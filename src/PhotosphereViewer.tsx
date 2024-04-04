import { Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import React, { useEffect, useState } from "react";
import {
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
} from "react-photo-sphere-viewer";

import { Hotspot2D, Hotspot3D, NavMap, Photosphere } from "./DataStructures";
import PopOver from "./PopOver";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import audioFile from "./assets/VFEdata/Scene12_UnevenStandTop_LS100146.mp3";
import mapImage from "./assets/VFEdata/map.jpg";

/** Convert yaw/pitch degrees from numbers to strings ending in "deg" */
function degToStr(val: number): string {
  return String(val) + "deg";
}

/** Convert hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Record<string, Hotspot3D>): MarkerConfig[] {
  const markers: MarkerConfig[] = Object.values(hotspots).map((hotspot) => {
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
    };
  });

  return markers;
}

function convertMap(map: NavMap): MapPluginConfig {
  // this line is so the map variable does not cause unused variable errors
  // TODO: remove this line after conversion functionality is completed
  void map;

  // TODO: conversion from NavMap instead of hardcoding
  return {
    imageUrl: mapImage,
    center: { x: 450, y: 800 },
    rotation: "0deg",
    defaultZoom: 20,
    hotspots: [
      {
        x: 95,
        y: 530,
        id: "West",
        color: "yellow",
        tooltip: "West",
      },
      {
        x: 450,
        y: 800,
        id: "South",
        color: "yellow",
        tooltip: "South",
      },
      {
        x: 650,
        y: 930,
        id: "Entrance",
        color: "yellow",
        tooltip: "Entrance",
      },
      {
        x: 550,
        y: 450,
        id: "East",
        color: "yellow",
        tooltip: "East",
      },
      {
        x: 390,
        y: 50,
        id: "North",
        color: "yellow",
        tooltip: "North",
      },
    ],
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

  const [hotspotArray, setHotspotArray] = useState<(Hotspot3D | Hotspot2D)[]>(
    [],
  );

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

  function handleReady(instance: Viewer) {
    const markerTestPlugin: MarkersPlugin = instance.getPlugin(MarkersPlugin);

    markerTestPlugin.addEventListener("select-marker", ({ marker }) => {
      const passMarker = props.photosphere.hotspots[marker.config.id];

      setHotspotArray([passMarker]);
    });
  }

  // function hideMarker(event: MouseEvent) {
  //   if (event.target === event.currentTarget) {
  //     setRenderClickedMarker(false);
  //   }
  // }

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
      {hotspotArray.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 49,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <button
            onClick={() => {
              setHotspotArray(hotspotArray.slice(0, -1));
            }}
          >
            Close
          </button>
          <PopOver
            hotspotData={hotspotArray[hotspotArray.length - 1].data}
            title={hotspotArray[hotspotArray.length - 1].tooltip}
            pushHotspot={(add: Hotspot2D) => {
              setHotspotArray([...hotspotArray, add]);
            }}
            popHotspot={() => {
              setHotspotArray(hotspotArray.slice(0, -1));
            }}
          />
        </div>
      )}

      <ReactPhotoSphereViewer
        onReady={handleReady}
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
