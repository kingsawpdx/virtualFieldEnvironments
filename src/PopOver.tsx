import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, alpha, lighten } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Hotspot2D, HotspotData } from "./DataStructures";

interface HotspotContentProps {
  hotspot: HotspotData;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
  arrayLength: number;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  marginBottom: "6px",
  marginRight: "6px",
};

function HotspotContent(props: HotspotContentProps) {
  switch (props.hotspot.tag) {
    case "Image": {
      return (
        <>
          {props.arrayLength > 1 && (
            <Button
              onClick={() => {
                props.popHotspot();
              }}
              variant="contained"
              style={buttonStyle}
            >
              <ArrowBackIcon />
            </Button>
          )}
          <Box position="relative">
            {Object.values(props.hotspot.hotspots).map((hotspot2D) => (
              <Box
                key={hotspot2D.tooltip}
                onClick={() => {
                  props.pushHotspot(hotspot2D);
                }}
                position="absolute"
                left={hotspot2D.x - 25}
                top={hotspot2D.y - 25}
                width={50}
                height={50}
                border={"5px solid"}
                borderColor={alpha(hotspot2D.color, 0.5)}
                sx={{
                  "&:hover": {
                    borderColor: lighten(hotspot2D.color, 0.5),
                    backgroundColor: alpha(hotspot2D.color, 0.25),
                  },
                }}
              />
            ))}
            <img
              style={{ width: "100%", objectFit: "contain" }}
              src={props.hotspot.src}
            />
          </Box>
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
    <Box sx={style}>
      <Typography variant="h4" component={"h4"}>
        {props.title}
      </Typography>

      <HotspotContent
        hotspot={props.hotspotData}
        pushHotspot={props.pushHotspot}
        popHotspot={props.popHotspot}
        arrayLength={props.arrayLength}
      />
    </Box>
  );
}

export default PopOver;
