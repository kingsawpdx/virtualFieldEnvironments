import { useState } from "react";

import { Hotspot3D } from "./DataStructures";

function degToStr(val: number): string {
  return String(val) + "deg";
}

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

function convertHotspot(hotspot: Hotspot3D) {
  if (!hotspot) return undefined;

  let content: string | undefined;

  switch (hotspot.data.tag) {
    case "Image":
      //content = pictureContent(hotspot.data.src);
      content = hotspot.data.src;
      //icon = imgIcon;
      break;
    case "Video":
      content = videoContent(hotspot.data.src);
      //icon =
      //  "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png"; // changed to make linter happy until icons are ready
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
    image: content,
    size: { width: 64, height: 64 },
    position: { yaw: degToStr(hotspot.yaw), pitch: degToStr(hotspot.pitch) },
    tooltip: hotspot.tooltip,
  };
}

export interface PopOverProps {
  hotspot: Hotspot3D | undefined;
  renderComponent: boolean;
}

function PopOver(props: PopOverProps) {
  const data = convertHotspot(props.hotspot!);
  const [displayContent, setDisplayContent] = useState(props.renderComponent);

  function hideContent() {
    setDisplayContent(false);
  }

  return (
    <div onClick={hideContent}>
      {displayContent ? (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            background: "rgba(0, 0, 0, 0.3)",
            width: "100vh",
            height: "100vh",
          }}
        >
          <div
            style={{
              display: "block",
              marginTop: "30%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: "20px",
              backgroundColor: "rgb(255,250,250)",
              width: "60%",
              borderRadius: "5px",
              maxHeight: "300px",
              overflow: "scroll",
            }}
          >
            <h1>{data?.id}</h1>
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={data?.image}
            ></img>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PopOver;
