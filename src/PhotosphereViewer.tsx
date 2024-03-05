import { ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import React, { useEffect, useState } from "react";
import {
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
} from "react-photo-sphere-viewer";

import { Hotspot3D, NavMap, Photosphere } from "./DataStructures";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
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

/** Convert hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Hotspot3D[]): MarkerConfig[] {
  if (hotspots.length == 0) return [];

  const markers: MarkerConfig[] = hotspots.map((hotspot) => {
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
      case "PhotosphereLink":
        break;
      case "URL":
        break;
      default:
        break;
    }

    return {
      id: hotspot.tooltip,
      image: icon,
      size: { width: 64, height: 64 },
      position: { yaw: degToStr(hotspot.yaw), pitch: degToStr(hotspot.pitch) },
      tooltip: hotspot.tooltip,
      content: content,
    };
  });

  return markers;
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
  photosphere: Photosphere;
  map: NavMap;
}

function PhotosphereViewer(props: PhotosphereViewerProps) {
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const photoSphereRef = React.createRef<ViewerAPI>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // handle change of panoramic image
  useEffect(() => {
    void photoSphereRef.current?.setPanorama(props.photosphere.src);
  }, [props.photosphere.src, photoSphereRef]);

  // handle change of hotspots
  useEffect(() => {
    const markers: MarkersPlugin | undefined =
      photoSphereRef.current?.getPlugin(MarkersPlugin);
    markers?.setMarkers(convertHotspots(props.photosphere.hotspots));
  }, [props.photosphere.hotspots, photoSphereRef]);

  // handle change of map
  useEffect(() => {
    const map: MapPlugin | undefined =
      photoSphereRef.current?.getPlugin(MapPlugin);

    const newOptions = convertMap(props.map);
    if (newOptions.imageUrl) map?.setImage(newOptions.imageUrl);
    if (newOptions.center) map?.setCenter(newOptions.center);
    if (newOptions.hotspots) map?.setHotspots(newOptions.hotspots);
    map?.setOption("rotation", newOptions.rotation);
  }, [props.map, photoSphereRef]);

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
    [MarkersPlugin, { markers: convertHotspots(props.photosphere.hotspots) }],
    [MapPlugin, convertMap(props.map)],
  ];

  console.log({ plugins });
  console.log(props.photosphere);
  console.log(props.map);

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
        ref={photoSphereRef}
        src={sampleScene}
        plugins={plugins}
        height={"100vh"}
        width={"100%"}
      />
    </div>
  );
}

export default PhotosphereViewer;
