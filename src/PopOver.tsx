import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

import { Hotspot2D, HotspotData } from "./DataStructures";

interface HotspotContentProps {
  hotspot: HotspotData;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
}

function HotspotContent(props: HotspotContentProps) {
  switch (props.hotspot.tag) {
    case "Image": {
      return (
        <>
          {Object.values(props.hotspot.hotspots).map((hotspot2D) => (
            <button
              key={hotspot2D.tooltip}
              onClick={() => {
                props.pushHotspot(hotspot2D);
              }}
            >
              Nested Hotspot: {hotspot2D.tooltip}
            </button>
          ))}
          <img
            style={{ width: "100%", objectFit: "contain" }}
            src={props.hotspot.src}
          ></img>
        </>
      );
    }
    case "Video":
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
  arrayLength: number;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
}

function PopOver(props: PopOverProps) {
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
        maxHeight: "400px",
        overflow: "scroll",
      }}
    >
      {props.arrayLength > 1 && (
        // <button
        //   onClick={() => {
        //     setHotspotArray(hotspotArray.slice(0, -1));
        //   }}
        // >
        //   Close
        // </button>
        <Button
          onClick={() => {
            props.popHotspot();
          }}
          variant="contained"
        >
          <ArrowBackIcon />
        </Button>
      )}
      <h1>{props.title}</h1>

      <HotspotContent
        hotspot={props.hotspotData}
        pushHotspot={props.pushHotspot}
        popHotspot={props.popHotspot}
      />
    </div>
  );
}

export default PopOver;
