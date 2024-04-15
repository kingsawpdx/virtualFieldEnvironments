import { Point, Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import {
  VirtualTourLink,
  VirtualTourNode,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import React, { useEffect, useState } from "react";
import {
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
  VirtualTourPlugin,
  VirtualTourPluginConfig,
} from "react-photo-sphere-viewer";

import AudioToggleButton from "./AudioToggleButton";
import {
  Hotspot2D,
  Hotspot3D,
  NavMap,
  Photosphere,
  VFE,
} from "./DataStructures";
import PhotosphereSelector from "./PhotosphereSelector";
import PopOver from "./PopOver";

/** Convert yaw/pitch degrees from numbers to strings ending in "deg" */
function degToStr(val: number): string {
  return String(val) + "deg";
}

/** Convert non-link hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Record<string, Hotspot3D>): MarkerConfig[] {
  const markers: MarkerConfig[] = [];

  for (const hotspot of Object.values(hotspots)) {
    if (hotspot.data.tag === "PhotosphereLink") continue;

    let icon =
      "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-blue.png"; // default

    switch (hotspot.data.tag) {
      case "Image":
        break;
      case "Video":
        icon =
          "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png"; // changed to make linter happy until icons are ready
        break;
      case "Audio":
        break;
      case "Doc":
        break;
      case "URL":
        break;
      default:
        break;
    }

    markers.push({
      id: hotspot.tooltip,
      image: icon,
      size: { width: 64, height: 64 },
      position: {
        yaw: degToStr(hotspot.yaw),
        pitch: degToStr(hotspot.pitch),
      },
      tooltip: hotspot.tooltip,
    });
  }

  return markers;
}

interface LinkData {
  tooltip: string;
}

/** Convert photosphere-link hotspots to virtual tour links  */
function convertLinks(hotspots: Record<string, Hotspot3D>): VirtualTourLink[] {
  const links: VirtualTourLink[] = [];

  for (const hotspot of Object.values(hotspots)) {
    if (hotspot.data.tag !== "PhotosphereLink") continue;

    links.push({
      nodeId: hotspot.data.photosphereID,
      position: {
        pitch: degToStr(hotspot.pitch),
        yaw: degToStr(hotspot.yaw),
      },
      data: { tooltip: hotspot.tooltip } as LinkData,
    });
  }

  return links;
}

function convertMap(map: NavMap, center: Point): MapPluginConfig {
  return {
    imageUrl: map.src,
    center,
    rotation: map.rotation,
    defaultZoom: map.defaultZoom,
    hotspots: map.hotspots.map((hotspot) => ({
      x: hotspot.x,
      y: hotspot.y,
      id: hotspot.id,
      color: hotspot.color,
      tooltip: hotspot.tooltip,
    })),
  };
}

export interface PhotosphereViewerProps {
  vfe: VFE;
  currentPS?: string;
  onChangePS?: (id: string) => void;
}

function PhotosphereViewer(props: PhotosphereViewerProps) {
  const photoSphereRef = React.createRef<ViewerAPI>();
  const defaultPhotosphere =
    props.vfe.photospheres[props.vfe.defaultPhotosphereID];
  const [currentPhotosphere, setCurrentPhotosphere] =
    React.useState<Photosphere>(defaultPhotosphere);
  const [hotspotArray, setHotspotArray] = useState<(Hotspot3D | Hotspot2D)[]>(
    [],
  );

  useEffect(() => {
    const virtualTour =
      photoSphereRef.current?.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
    void virtualTour?.setCurrentNode(currentPhotosphere.id);

    const map = photoSphereRef.current?.getPlugin<MapPlugin>(MapPlugin);
    map?.setCenter(currentPhotosphere.center);
  }, [currentPhotosphere, photoSphereRef]);

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, {}],
    [MapPlugin, convertMap(props.vfe.map, defaultPhotosphere.center)],
    [
      VirtualTourPlugin,
      {
        renderMode: "markers",
        getLinkTooltip(_content: string, link: VirtualTourLink): string {
          return (link.data as LinkData).tooltip;
        },
      } as VirtualTourPluginConfig,
    ],
  ];

  function handleReady(instance: Viewer) {
    const markerTestPlugin: MarkersPlugin = instance.getPlugin(MarkersPlugin);

    markerTestPlugin.addEventListener("select-marker", ({ marker }) => {
      const passMarker = currentPhotosphere.hotspots[marker.config.id];

      setHotspotArray([passMarker]);
    });

    const virtualTour =
      instance.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);

    const nodes: VirtualTourNode[] = Object.values(props.vfe.photospheres).map(
      (p) => {
        return {
          id: p.id,
          panorama: p.src,
          name: p.id,
          markers: convertHotspots(p.hotspots),
          links: convertLinks(p.hotspots),
        };
      },
    );

    // need to have conditional so that scene doesn't change when adding hotspots
    virtualTour.setNodes(
      nodes,
      props.currentPS ? props.currentPS : defaultPhotosphere.id,
    );
    virtualTour.addEventListener("node-changed", ({ node }) => {
      setCurrentPhotosphere(props.vfe.photospheres[node.id]);
      props.onChangePS?.(node.id);
      setHotspotArray([]); // clear popovers on scene change
    });

    const map = instance.getPlugin<MapPlugin>(MapPlugin);
    map.addEventListener("select-hotspot", ({ hotspotId }) => {
      const hotspot: Hotspot2D | undefined = props.vfe.map.hotspots.find(
        (hotspot) => hotspot.id === hotspotId,
      );
      if (hotspot?.data.tag === "PhotosphereLink") {
        setCurrentPhotosphere(
          props.vfe.photospheres[hotspot.data.photosphereID],
        );
        props.onChangePS?.(hotspot.data.photosphereID);
      }
    });
  }

  return (
    <>
      <PhotosphereSelector
        options={Object.keys(props.vfe.photospheres)}
        value={currentPhotosphere.id}
        setValue={(id) => {
          setCurrentPhotosphere(props.vfe.photospheres[id]);
          props.onChangePS?.(id);
        }}
      />

      {hotspotArray.length > 0 && (
        <PopOver
          hotspotData={hotspotArray[hotspotArray.length - 1].data}
          title={hotspotArray[hotspotArray.length - 1].tooltip}
          arrayLength={hotspotArray.length}
          pushHotspot={(add: Hotspot2D) => {
            setHotspotArray([...hotspotArray, add]);
          }}
          popHotspot={() => {
            setHotspotArray(hotspotArray.slice(0, -1));
          }}
          closeAll={() => {
            setHotspotArray([]);
          }}
        />
      )}

      {currentPhotosphere.backgroundAudio && (
        <AudioToggleButton src={currentPhotosphere.backgroundAudio} />
      )}

      <ReactPhotoSphereViewer
        onReady={handleReady}
        ref={photoSphereRef}
        src={defaultPhotosphere.src}
        plugins={plugins}
        height={"100vh"}
        width={"100%"}
        navbar={["autorotate", "zoom", "caption", "download", "fullscreen"]}
      />
    </>
  );
}

export default PhotosphereViewer;
