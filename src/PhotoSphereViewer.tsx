import { ViewerConfig } from "@photo-sphere-viewer/core";
import {
  MarkersPlugin,
  ReactPhotoSphereViewer,
} from "react-photo-sphere-viewer";

import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import paddlers from "./assets/VFEdata/paddlers.mp4";
import shorelineSOUTH from "./assets/VFEdata/shorelineSOUTH.mp4";

function videoContent(src: string): string {
  return `<video controls style="max-width: 100%; max-height: 100%">
  <source src="${src}" type="video/mp4" />
</video>`;
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
