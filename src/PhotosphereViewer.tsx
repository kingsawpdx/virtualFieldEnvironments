import { Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import {
  VirtualTourLink,
  VirtualTourNode,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import React, { useEffect, useState } from "react";
import {
  GalleryPlugin,
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
  VirtualTourPlugin,
} from "react-photo-sphere-viewer";

import { Hotspot3D, NavMap, VFE } from "./DataStructures";
import audioFile from "./assets/VFEdata/Scene12_UnevenStandTop_LS100146.mp3";

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
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const photoSphereRef = React.createRef<ViewerAPI>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // handle change of map
  useEffect(() => {
    const map: MapPlugin | undefined =
      photoSphereRef.current?.getPlugin(MapPlugin);

    const newOptions = convertMap(props.vfe.map);
    if (newOptions.imageUrl) map?.setImage(newOptions.imageUrl);
    if (newOptions.center) map?.setCenter(newOptions.center);
    if (newOptions.hotspots) map?.setHotspots(newOptions.hotspots);
    map?.setOption("rotation", newOptions.rotation);
  }, [props.vfe.map, photoSphereRef]);

  useEffect(() => {
    const audio = new Audio(audioFile);
    // Check if theres user interaction
    if (isUserInteracted && isAudioPlaying) {
      //Make a new audio object with the imported audio file
      //Try to play the audio file, have to use void to indicate were not going to promise to handle the returned type
      void audio.play().catch((e) => {
        //Debug for errors
        console.error("Error playing audio:", e);
      });
    }
    //Cleanup function to pause audio when the component unmounts
    return () => {
      if (isUserInteracted) {
        audio.pause();
      }
    };
    //Depends on the isUserInteracted state, reruns if it changes
  }, [isUserInteracted, isAudioPlaying]);

  //Handler function to set the state to true
  function handleUserInteraction() {
    setIsUserInteracted(true);
    setIsAudioPlaying(!isAudioPlaying);
  }

  //toggles state of audio upon button press
  function toggleAudio() {
    setIsAudioPlaying((prevIsAudioPlaying) => !prevIsAudioPlaying);
  }

  // If I cant get the user interaction forced I made the button
  if (!isUserInteracted) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleUserInteraction}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Start Virtual Environment
        </button>
      </div>
    );
  }

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, {}],
    [GalleryPlugin, {}],
    [MapPlugin, convertMap(props.vfe.map)],
    [VirtualTourPlugin, { renderMode: "markers" }],
  ];

  console.log({ plugins });

  function onReady(instance: Viewer) {
    const virtualTour: VirtualTourPlugin =
      instance.getPlugin(VirtualTourPlugin);

    const nodes: VirtualTourNode[] = props.vfe.photospheres.map((p) => {
      return {
        id: p.id,
        panorama: p.src,
        thumbnail: p.src,
        name: p.id,
        markers: convertHotspots(p.hotspots),
        links: convertLinks(p.hotspots),
      };
    });

    virtualTour.setNodes(nodes, nodes[0].id);
  }

  return (
    //if user already interacted start, then display audio button
    <div>
      <button
        onClick={toggleAudio}
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "18px", // Adjust this value to change the vertical position
          left: "1325px", // Adjust this value to change the horizontal position
        }}
      >
        {isAudioPlaying ? "Pause Audio" : "Play Audio"}
      </button>

      <ReactPhotoSphereViewer
        onReady={onReady}
        ref={photoSphereRef}
        src={props.vfe.photospheres[0].src}
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
    </div>
  );
}

export default PhotosphereViewer;
