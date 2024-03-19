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

function NestedHotspots(props: { hotspot?: Hotspot3D }) {
  const [selectedNestedHotspot, setSelectedNestedHotspot] = useState<
    Hotspot3D | undefined
  >();

  if (props.hotspot?.data.tag !== "Image") {
    return <></>;
  }

  return (
    <>
      {props.hotspot.data.hotspots.map((hotspot2D) => (
        <button
          key={hotspot2D.tooltip}
          onClick={() => {
            setSelectedNestedHotspot({ ...hotspot2D, pitch: 0, yaw: 0 });
          }}
        >
          Open Nested Hotspot: {hotspot2D.tooltip}
        </button>
      ))}
      <PopOver
        renderComponent={selectedNestedHotspot !== undefined}
        onClose={() => {
          setSelectedNestedHotspot(undefined);
        }}
        hotspot={selectedNestedHotspot}
      />
    </>
  );
}

export interface PopOverProps {
  hotspot: Hotspot3D | undefined;
  renderComponent: boolean;
  onClose: () => void;
}

function PopOver(props: PopOverProps) {
  const data = convertHotspot(props.hotspot!);

  return (
    <div>
      {props.renderComponent ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 50,
            background: "rgba(0, 0, 0, 0.3)",
            width: "100vh",
            height: "100vh",
          }}
        >
          <div
            style={{
              display: "block",
              marginTop: "20%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: "20px",
              backgroundColor: "rgb(255,250,250)",
              width: "60%",
              borderRadius: "5px",
              maxHeight: "60%",
              overflow: "scroll",
            }}
          >
            <button onClick={props.onClose}>Close Hotspot</button>
            <br />
            <NestedHotspots hotspot={props.hotspot} />
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
