import { Point, Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MapHotspot } from "@photo-sphere-viewer/map-plugin";
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
const [accessLevel, setAccessLevel] = useState(0);

/** Convert yaw/pitch degrees from numbers to strings ending in "deg" */
function degToStr(val: number): string {
  return String(val) + "deg";
}

/** Convert sizes from numbers to strings ending in "px" */
function sizeToStr(val: number): string {
  return String(val) + "px";
}

/** Convert non-link hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Record<string, Hotspot3D>): MarkerConfig[] {
  const markers: MarkerConfig[] = [];

  for (const hotspot of Object.values(hotspots)) {
    if (hotspot.data.tag === "PhotosphereLink" || hotspot.accessLevel && hotspot.accessLevel > accessLevel) continue;

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
    if (hotspot.data.tag !== "PhotosphereLink" ) continue; 
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

function convertMap(
  map: NavMap,
  photospheres: Record<string, Photosphere>,
  currentCenter?: Point,
): MapPluginConfig {
  const hotspots: MapHotspot[] = [];

  for (const [id, photosphere] of Object.entries(photospheres)) {
    if (photosphere.center === undefined) continue;

    hotspots.push({
      id: id,
      tooltip: id,
      x: photosphere.center.x,
      y: photosphere.center.y,
      color: "yellow",
    });
  }

  return {
    imageUrl: map.src,
    center: currentCenter ?? map.defaultCenter,
    rotation: map.rotation,
    defaultZoom: map.defaultZoom,
    minZoom: 1,
    maxZoom: 100,
    size: sizeToStr(map.size),
    hotspots,
  };
}

export interface PhotosphereViewerProps {
  vfe: VFE;
  currentPS?: string;
  onChangePS?: (id: string) => void;
  onViewerClick?: (pitch: number, yaw: number) => void;
}

function PhotosphereViewer(props: PhotosphereViewerProps) {
  const photoSphereRef = React.createRef<ViewerAPI>();
  const defaultPhotosphere =
    props.vfe.photospheres[props.vfe.defaultPhotosphereID];
  // conditional fixes popover not rendering on non-default photosphere problem
  const [currentPhotosphere, setCurrentPhotosphere] =
    React.useState<Photosphere>(
      props.currentPS
        ? props.vfe.photospheres[props.currentPS]
        : defaultPhotosphere,
    );
  const [hotspotArray, setHotspotArray] = useState<(Hotspot3D | Hotspot2D)[]>(
    [],
  );

  useEffect(() => {
    const virtualTour =
      photoSphereRef.current?.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
    void virtualTour?.setCurrentNode(currentPhotosphere.id);

    const map = photoSphereRef.current?.getPlugin<MapPlugin>(MapPlugin);
    if (currentPhotosphere.center) {
      map?.setCenter(currentPhotosphere.center);
    }
  }, [currentPhotosphere, photoSphereRef]);

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, {}],

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

  // Only enable map plugin when VFE has a map
  if (props.vfe.map) {
    plugins.push([
      MapPlugin,
      convertMap(
        props.vfe.map,
        props.vfe.photospheres,
        defaultPhotosphere.center,
      ),
    ]);
  }

  function handleReady(instance: Viewer) {
    const markerTestPlugin: MarkersPlugin = instance.getPlugin(MarkersPlugin);

    markerTestPlugin.addEventListener("select-marker", ({ marker }) => {
      if (marker.config.id.includes("__tour-link")) return;

      const passMarker = currentPhotosphere.hotspots[marker.config.id];

      setHotspotArray([passMarker]);
    });

    instance.addEventListener("click", ({ data }) => {
      if (!data.rightclick) {
        props.onViewerClick?.(data.pitch, data.yaw);
      }
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
      const photosphere = props.vfe.photospheres[hotspotId];
      setCurrentPhotosphere(photosphere);
      props.onChangePS?.(photosphere.id);
    });
  }

  // Example function to update access level
  function updateAccessLevel(newLevel: number) {
    setAccessLevel(newLevel);
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
      {/* Temporary access level selector */}
      <select onChange={(e) => updateAccessLevel(Number(e.target.value))}> 
        <option value="0">Level 0</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
      </select>

      <ReactPhotoSphereViewer
        onReady={handleReady}
        ref={photoSphereRef}
        src={defaultPhotosphere.src}
        plugins={plugins}
        height={"100vh"}
        width={"100%"}
        navbar={accessLevel > 1 ? ["autorotate", "zoom", "caption", "download", "fullscreen"] : ["autorotate", "zoom"]}
      />
    </>
  );
}

export default PhotosphereViewer;
