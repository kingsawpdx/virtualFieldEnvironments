import { ArrowBack, Close, Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";

import { Hotspot2D, HotspotData } from "./DataStructures";

interface HotspotContentProps {
  hotspot: HotspotData;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
  arrayLength: number;
}

function HotspotContent(props: HotspotContentProps) {
  switch (props.hotspot.tag) {
    case "Image": {
      return (
        <Box position="relative">
          {Object.values(props.hotspot.hotspots).map((hotspot2D) => (
            <Box
              key={hotspot2D.tooltip}
              onClick={() => {
                props.pushHotspot(hotspot2D);
              }}
              position="absolute"
              left={`${hotspot2D.x}%`}
              top={`${hotspot2D.y}%`}
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
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
            }}
            src={props.hotspot.src.path}
          />
        </Box>
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
  closeAll: () => void;
  isEditorMode: boolean;
  onDeleteHotspot: () => void;
}

function PopOver(props: PopOverProps) {
  return (
    <Dialog
      open={true}
      onClose={props.closeAll}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          <Box flexGrow={1}>{props.title}</Box>
          {props.isEditorMode && (
            <Tooltip title="Delete Hotspot" placement="top">
              <IconButton
                onClick={() => {
                  // This is where the delete functionality will go
                  props.onDeleteHotspot();
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          {props.arrayLength > 1 && (
            <Tooltip title="Back" placement="top">
              <IconButton
                onClick={() => {
                  props.popHotspot();
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close" placement="top">
            <IconButton onClick={props.closeAll}>
              <Close />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <HotspotContent
          hotspot={props.hotspotData}
          pushHotspot={props.pushHotspot}
          popHotspot={props.popHotspot}
          arrayLength={props.arrayLength}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PopOver;
