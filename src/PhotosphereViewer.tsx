import { Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import {
  VirtualTourLink,
  VirtualTourNode,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import React, { useEffect } from "react";
import {
  GalleryPlugin,
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
  VirtualTourPlugin,
} from "react-photo-sphere-viewer";

import AudioToggleButton from "./AudioToggleButton";
import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures";
import PhotosphereSelector from "./PhotosphereSelector";

function videoContent(src: string): string {
  return `<video controls style="max-width: 100%; max-height: 100%">
  <source src="${src}" type="video/mp4" />
</video>`;
}

function pictureContent(imageSrc: string) {
  return `
    <img src="${imageSrc}" alt="Marker Image" style= "max-width:380px; max-height: 500px";/>
    `;
}

/** Convert yaw/pitch degrees from numbers to strings ending in "deg" */
function degToStr(val: number): string {
  return String(val) + "deg";
}

/** Convert non-link hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Hotspot3D[]): MarkerConfig[] {
  const markers: MarkerConfig[] = [];

  for (const hotspot of hotspots) {
    if (hotspot.data.tag === "PhotosphereLink") continue;

    let content: string | undefined = undefined;
    let icon =
      "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-blue.png"; // default

    switch (hotspot.data.tag) {
      case "Image":
        content = pictureContent(hotspot.data.src);
        //icon = imgIcon;
        break;
      case "Video":
        content = videoContent(hotspot.data.src);
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
      content: content,
    });
  }

  return markers;
}

/** Convert photosphere-link hotspots to virtual tour links  */
function convertLinks(hotspots: Hotspot3D[]): VirtualTourLink[] {
  const links: VirtualTourLink[] = [];

  for (const hotspot of hotspots) {
    if (hotspot.data.tag !== "PhotosphereLink") continue;

    links.push({
      nodeId: hotspot.data.photosphereID,
      position: {
        pitch: degToStr(hotspot.pitch),
        yaw: degToStr(hotspot.yaw),
      },
    });
  }

  return links;
}

function convertMap(map: NavMap): MapPluginConfig {
  return {
    imageUrl: map.src,
    center: map.center,
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
}

function PhotosphereViewer(props: PhotosphereViewerProps) {
  const photoSphereRef = React.createRef<ViewerAPI>();

  const defaultPhotosphere =
    props.vfe.photospheres[props.vfe.defaultPhotosphereID];
  const [currentPhotosphere, setCurrentPhotosphere] =
    React.useState<Photosphere>(defaultPhotosphere);

  useEffect(() => {
    const virtualTour =
      photoSphereRef.current?.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);

    void virtualTour?.setCurrentNode(currentPhotosphere.id);
  }, [currentPhotosphere, photoSphereRef]);

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, {}],
    [GalleryPlugin, {}],
    [MapPlugin, convertMap(props.vfe.map)],
    [VirtualTourPlugin, { renderMode: "markers" }],
  ];

  function handleReady(instance: Viewer) {
    const virtualTour =
      instance.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);

    const nodes: VirtualTourNode[] = Object.values(props.vfe.photospheres).map(
      (p) => {
        return {
          id: p.id,
          panorama: p.src,
          thumbnail: p.src,
          name: p.id,
          markers: convertHotspots(p.hotspots),
          links: convertLinks(p.hotspots),
        };
      },
    );

    virtualTour.setNodes(nodes, defaultPhotosphere.id);
    virtualTour.addEventListener("node-changed", ({ node }) => {
      setCurrentPhotosphere(props.vfe.photospheres[node.id]);
    });
  }

  return (
    <>
      <PhotosphereSelector
        options={Object.keys(props.vfe.photospheres)}
        value={currentPhotosphere.id}
        setValue={(id) => {
          setCurrentPhotosphere(props.vfe.photospheres[id]);
        }}
      />

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
        navbar={[
          "autorotate",
          "zoom",
          "gallery",
          "caption",
          "download",
          "fullscreen",
        ]}
      />
    </>
  );
}

export default PhotosphereViewer;
