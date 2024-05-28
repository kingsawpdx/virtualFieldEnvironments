import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ArrowBack, Close, Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  alpha,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

import { Hotspot2D, HotspotData } from "./DataStructures";

interface HotspotContentProps {
  hotspot: HotspotData;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
  arrayLength: number;
}

function HotspotContent(props: HotspotContentProps) {
  const [answer, setAnswer] = useState(""); // State to hold the answer
  const [feedback, setFeedback] = useState("");

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
      return (
        <ReactPlayer
          url={props.hotspot.src.path}
          controls={true}
          style={{
            maxWidth: "100%",
            maxHeight: "70vh",
          }}
        />
      );
    case "Audio":
      return (
        <AudioPlayer
          style={{ width: "50vh", maxHeight: "70vh" }}
          showSkipControls={false}
          showJumpControls={false}
          showDownloadProgress={false}
          src={props.hotspot.src.path}
        />
      );
    case "Doc": {
      const docs = [{ uri: props.hotspot.content }];
      return (
        <DocViewer
          style={{ width: "80vw", height: "70vh" }}
          documents={docs}
          pluginRenderers={DocViewerRenderers}
        />
      );
    }
    case "PhotosphereLink":
      break;
    case "URL":
      return (
        <Box width={"80vw"} height={"70vh"} fontFamily={"Helvetica"}>
          To view the link in a new tab, click the title.
          <iframe
            style={{
              marginTop: "10px",
              width: "80vw",
              height: "70vh",
            }}
            src={props.hotspot.src}
          />
        </Box>
      );
    case "Quiz": {
      const hotspotAnswer = props.hotspot.answer;
      return (
        <Box>
          <Box>{"Question: " + props.hotspot.question}</Box>
          <TextField
            variant="outlined"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (
                answer.trim().toLowerCase() ===
                hotspotAnswer.trim().toLowerCase()
              ) {
                setFeedback("Correct!");
              } else {
                setFeedback("Incorrect! Try again.");
              }
            }}
          >
            Submit
          </Button>

          <Box sx={{ mt: 2 }} color={feedback === "Correct!" ? "green" : "red"}>
            {feedback}
          </Box>
        </Box>
      );
    }
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
  onDeleteHotspot?: () => void;
}

function PopOver(props: PopOverProps) {
  return (
    <Dialog
      open={true}
      onClose={props.closeAll}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={false}
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          {props.onDeleteHotspot !== undefined && (
            <Tooltip title="Delete Hotspot" placement="top">
              <IconButton
                onClick={() => {
                  // This is where the delete functionality will go
                  props.onDeleteHotspot?.();
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          {props.hotspotData.tag == "URL" ? (
            <Box flexGrow={1}>
              <a href={props.hotspotData.src} target="_blank" rel="noreferrer">
                {props.title}
              </a>
            </Box>
          ) : (
            <Box flexGrow={1}>{props.title}</Box>
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
