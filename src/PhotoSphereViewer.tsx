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

import Contact from "./assets/VFEdata/Contact.png";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import audioFile from "./assets/VFEdata/Scene12_UnevenStandTop_LS100146.mp3";
import SouthwaterFront from "./assets/VFEdata/SouthwaterFront.png";
import closerLook from "./assets/VFEdata/a-closer-look.jpg";
import coolLog from "./assets/VFEdata/cool_log.jpeg";
import flowers from "./assets/VFEdata/flowers.png";
import handSample from "./assets/VFEdata/hand_sample.png";
import logNEARshorline from "./assets/VFEdata/logNEARshoreline.png";
import mapImage from "./assets/VFEdata/map.jpg";
import mushroom from "./assets/VFEdata/mushroom.png";
import outcropWide from "./assets/VFEdata/outcropWideView.png";
import outcropTextures from "./assets/VFEdata/outcrop_textures.mp4";
import paddlers from "./assets/VFEdata/paddlers.mp4";
import shorelineSOUTH from "./assets/VFEdata/shorelineSOUTH.mp4";
import smallPool from "./assets/VFEdata/small_pool.jpg";
import SEMComp from "./assets/VFEdata/southSEMcomp.png";
import { HotSpot3d, NavMap, Photosphere } from "./dataStructures";

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

const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";

function convertHotspots(hotspots: HotSpot3d[]): MarkerConfig[] {
  if (hotspots.length == 0) return [];

  // TODO: conversion from hotspots instead of hardcoding
  return [
    {
      id: "outcropWideView",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-5deg", pitch: "5deg" },
      tooltip: "Outcrop wideview",
      content: pictureContent(outcropWide),
    },
    {
      id: "flowers",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "18deg", pitch: "-3deg" },
      tooltip: "Flowers",
      content: pictureContent(flowers),
    },
    {
      id: "shorelineSOUTH",
      image: baseUrl + "pictos/pin-red.png",
      size: { width: 64, height: 64 },
      position: { yaw: "172deg", pitch: "-32deg" },
      tooltip: "shorelineSOUTH.mp4",
      content: videoContent(shorelineSOUTH),
    },
    {
      id: "paddlers",
      image: baseUrl + "pictos/pin-red.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-175deg", pitch: "-10deg" },
      tooltip: "paddlers.mp4",
      content: videoContent(paddlers),
    },
    {
      id: "small pool",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "100deg", pitch: "-13deg" },
      content: pictureContent(smallPool),
      tooltip: "small pool",
    },
    {
      id: "log near shoreline",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-40deg", pitch: "-25deg" },
      content: pictureContent(logNEARshorline),
      tooltip: "log near shoreline",
    },
    {
      id: "coolLog",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-33deg", pitch: "-17deg" },
      content: pictureContent(coolLog),
      tooltip: "a cool log",
    },
    {
      id: "handSample",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-44deg", pitch: "0deg" },
      content: pictureContent(handSample),
      tooltip: "hand sample of stone",
    },
    {
      id: "outcropTextures",
      image: baseUrl + "pictos/pin-red.png",
      size: { width: 64, height: 64 },
      position: { yaw: "5deg", pitch: "6deg" },
      content: videoContent(outcropTextures),
      tooltip: "outcrop textures video",
    },
    {
      id: "logs",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-37deg", pitch: "-12deg" },
      tooltip: "How did these huge logs get here?",
    },
    {
      id: "mushroom",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-19deg", pitch: "2deg" },
      content: pictureContent(mushroom),
      tooltip: "mushroom",
    },
    {
      id: "closerLook",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-46deg", pitch: "-2deg" },
      content: pictureContent(closerLook),
      tooltip: "A closer look",
    },
    {
      id: "SEMComp",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-48deg", pitch: "0deg" },
      content: pictureContent(SEMComp),
      tooltip: "South SEM Comparisson",
    },
    {
      id: "Contact",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-46deg", pitch: "2deg" },
      content: pictureContent(Contact),
      tooltip: "Contact",
    },
    {
      id: "South Waterfront",
      image: baseUrl + "pictos/pin-blue.png",
      size: { width: 64, height: 64 },
      position: { yaw: "-25deg", pitch: "-1deg" },
      content: pictureContent(SouthwaterFront),
      tooltip: "South Waterfront",
    },
  ];
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
export interface PhotoSphereViewerProps {
  photosphere: Photosphere;
  map: NavMap;
}

function PhotoSphereViewer(props: PhotoSphereViewerProps) {
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const photoSphereRef = React.createRef<ViewerAPI>();

  // handle change of panoramic image
  useEffect(() => {
    void photoSphereRef.current?.setPanorama(props.photosphere.src);
  }, [props.photosphere.src, photoSphereRef]);

  // handle change of hotspots
  useEffect(() => {
    const markers: MarkersPlugin | undefined =
      photoSphereRef.current?.getPlugin(MarkersPlugin);
    markers?.setMarkers(convertHotspots(props.photosphere.hotspot));
  }, [props.photosphere.hotspot, photoSphereRef]);

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
    if (isUserInteracted) {
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
  }, [isUserInteracted]);

  //Handler function to set the state to true
  function handleUserInteraction() {
    setIsUserInteracted(true);
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
          Start Virtual Enviornment
        </button>
      </div>
    );
  }

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, { markers: convertHotspots(props.photosphere.hotspot) }],
    [MapPlugin, convertMap(props.map)],
  ];

  console.log({ plugins });
  console.log(props.photosphere);
  console.log(props.map);

  return (
    <ReactPhotoSphereViewer
      ref={photoSphereRef}
      src={sampleScene}
      plugins={plugins}
      height={"100vh"}
      width={"100%"}
    />
  );
}

export default PhotoSphereViewer;
