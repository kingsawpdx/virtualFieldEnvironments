import { ViewerConfig } from "@photo-sphere-viewer/core";
import {
  MarkersPlugin,
  ReactPhotoSphereViewer,
} from "react-photo-sphere-viewer";

import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import rock from "./assets/VFEdata/basalt1-vein-SEMcloseup-BSE100x.jpeg";
import coolLog from "./assets/VFEdata/cool_log.jpeg";
import handSample from "./assets/VFEdata/hand_sample.png";
import logNEARshorline from "./assets/VFEdata/logNEARshoreline.png";
import mushroom from "./assets/VFEdata/mushroom.png";
import outcropTextures from "./assets/VFEdata/outcrop_textures.mp4";
import paddlers from "./assets/VFEdata/paddlers.mp4";
import shorelineSOUTH from "./assets/VFEdata/shorelineSOUTH.mp4";
import smallPool from "./assets/VFEdata/small_pool.jpg";

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

function PhotoSphereViewer() {
  const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";

  const plugins: ViewerConfig["plugins"] = [
    [
      MarkersPlugin,
      {
        markers: [
          {
            id: "image",
            image: baseUrl + "pictos/pin-blue.png",
            size: { width: 64, height: 64 },
            position: { yaw: "-5deg", pitch: "5deg" },
            tooltip: "Outcrop wideview",
          },
          {
            id: "image2",
            image: baseUrl + "pictos/pin-blue.png",
            size: { width: 64, height: 64 },
            position: { yaw: "18deg", pitch: "-3deg" },
            content: "Look at these flowers",
            tooltip: "Flowers",
          },
          {
            id: "image3",
            image: baseUrl + "pictos/pin-blue.png",
            size: { width: 64, height: 64 },
            position: { yaw: "45deg", pitch: "10deg" },
            tooltip: "Modify!",
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
        ],
      },
    ],
  ];

  console.log({ plugins });

  return (
    <ReactPhotoSphereViewer
      src={sampleScene}
      plugins={plugins}
      height={"100vh"}
      width={"100%"}
    ></ReactPhotoSphereViewer>
  );
}

export default PhotoSphereViewer;
