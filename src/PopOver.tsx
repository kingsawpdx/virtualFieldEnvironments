import { useState } from "react";

import { Hotspot2D, Hotspot3D, HotspotData } from "./DataStructures";

// function degToStr(val: number): string {
//   return String(val) + "deg";
// }

// function videoContent(src: string): string {
//   return `<video controls style="max-width: 100%; max-height: 100%">
//   <source src="${src}" type="video/mp4" />
// </video>`;
// }

// function pictureContent(imageSrc: string) {
//   return `
//     <img src="${imageSrc}" alt="Marker Image" style= "max-width:380px; max-height: 500px";/>
//     `;
// }

interface HotspotContentProps {
  hotspot: HotspotData;
}

function HotspotContent(props: HotspotContentProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot2D | undefined>(
    undefined,
  );

  switch (props.hotspot.tag) {
    case "Image": {
      //content = pictureContent(hotspot.data.src);
      return (
        <>
          {props.hotspot.hotspots.map((hotspot2D) => (
            <button
              key={hotspot2D.tooltip}
              onClick={() => {
                setSelectedHotspot(hotspot2D);
              }}
            >
              Nested Hotspot: {hotspot2D.tooltip}
            </button>
          ))}
          <img
            style={{ width: "100%", objectFit: "contain" }}
            src={props.hotspot.src}
          ></img>
          {selectedHotspot && (
            <PopOver
              title={selectedHotspot.tooltip}
              hotspotData={selectedHotspot.data}
            ></PopOver>
          )}
        </>
      );
    }
    case "Video":
      // content = videoContent(hotspot.src);
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
}

export interface PopOverProps {
  hotspotData: HotspotData;
  title: string;
}

function PopOver(props: PopOverProps) {
  //const data = convertHotspot(props.hotspot!);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 50,
        top: 0,
        left: 0,
        right: 0,
        marginTop: "10%",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "20px",
        backgroundColor: "rgb(255,250,250)",
        width: "60vw",
        borderRadius: "5px",
        maxHeight: "300px",
        overflow: "scroll",
      }}
    >
      <h1>{props.title}</h1>

      <HotspotContent hotspot={props.hotspotData} />
    </div>
  );
}

export default PopOver;