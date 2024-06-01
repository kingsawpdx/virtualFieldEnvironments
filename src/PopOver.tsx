import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ArrowBack, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

import { Hotspot2D, Hotspot3D, HotspotData } from "./DataStructures";
import HotspotEditor, { HotspotIcon, NestedHotspotBox } from "./HotspotEditor";
import { confirmMUI } from "./StyledConfirmWrapper";

interface HotspotContentProps {
  hotspot: HotspotData;
  openNestedHotspot: (add: Hotspot2D) => void;
}

function HotspotContent({ hotspot, openNestedHotspot }: HotspotContentProps) {
  const [answer, setAnswer] = useState(""); // State to hold the answer
  const [feedback, setFeedback] = useState("");

  switch (hotspot.tag) {
    case "Image": {
      return (
        <Box position="relative" overflow="hidden">
          {Object.values(hotspot.hotspots).map((hotspot2D) => (
            <Tooltip key={hotspot2D.id} title={hotspot2D.tooltip}>
              <NestedHotspotBox
                hotspot={hotspot2D}
                onClick={() => {
                  openNestedHotspot(hotspot2D);
                }}
              />
            </Tooltip>
          ))}
          <img
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: "4px",
              userSelect: "none",
            }}
            src={hotspot.src.path}
          />
        </Box>
      );
    }
    case "Video":
      return (
        <ReactPlayer
          url={hotspot.src.path}
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
          style={{
            width: "50vh",
            height: "150px",
            marginTop: 3,
            borderRadius: 5,
          }}
          showSkipControls={false}
          showJumpControls={false}
          showDownloadProgress={false}
          src={hotspot.src.path}
        />
      );
    case "Doc": {
      const docs = [{ uri: hotspot.src.path }];
      return (
        <DocViewer
          style={{ width: "80vw", height: "70vh" }}
          documents={docs}
          pluginRenderers={DocViewerRenderers}
        />
      );
    }
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
            src={hotspot.url}
          />
        </Box>
      );
    case "Message":
      return (
        <Box width={"20vw"} maxHeight={"70vh"}>
          <Typography sx={{ wordWrap: "break-word" }}>
            {hotspot.content}
          </Typography>
        </Box>
      );
    case "PhotosphereLink":
      break;
    case "Quiz": {
      const hotspotAnswer = hotspot.answer;
      return (
        <Box>
          <Box>{"Question: " + hotspot.question}</Box>
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
  hotspotPath: string[];
  hotspot: Hotspot2D | Hotspot3D;
  pushHotspot: (add: Hotspot2D) => void;
  popHotspot: () => void;
  closeAll: () => void;
  onUpdateHotspot?: (
    hotspotPath: string[],
    newTooltip: string,
    newData: HotspotData | null,
  ) => void;
}

function PopOver(props: PopOverProps) {
  const [edited, setEdited] = useState(false);
  const [previewTooltip, setPreviewTooltip] = useState(props.hotspot.tooltip);
  const [previewData, setPreviewData] = useState<HotspotData | null>(
    props.hotspot.data,
  );
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  async function keepChanges() {
    const confirmed = await confirmMUI(
      "All changes to the current hotspot will be lost. Continue?",
    );
    return !confirmed;
  }

  async function confirmClose() {
    if (edited && (await keepChanges())) {
      return;
    }

    props.closeAll();
  }

  async function confirmBack() {
    if (edited && (await keepChanges())) {
      return;
    }

    props.popHotspot();
  }

  async function resetHotspot() {
    if (edited && (await keepChanges())) {
      return;
    }

    setPreviewData(props.hotspot.data);
    setEdited(false);
  }

  function deleteHotspot() {
    props.onUpdateHotspot?.(props.hotspotPath, previewTooltip, null);
  }

  function updateHotspot(newTooltip: string, newData: HotspotData) {
    props.onUpdateHotspot?.(props.hotspotPath, newTooltip, newData);
  }

  function openNestedHotspot(hotspot2D: Hotspot2D) {
    if (edited) {
      setSnackbarMessage(
        "Nested hotspots cannot be opened when there are unsaved changes.",
      );
      return;
    }

    props.pushHotspot(hotspot2D);
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={() => {
          void confirmClose();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={false}
        scroll="body"
        transitionDuration={0}
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row" alignItems="center" gap={1}>
            {previewData && (
              <HotspotIcon
                hotspotData={previewData}
                color={
                  "color" in props.hotspot ? props.hotspot.color : undefined
                }
                icon={"icon" in props.hotspot ? props.hotspot.icon : undefined}
              />
            )}
            {previewData?.tag == "URL" ? (
              <Box flexGrow={1}>
                <a href={previewData.url} target="_blank" rel="noreferrer">
                  {previewTooltip}
                </a>
              </Box>
            ) : (
              <Box flexGrow={1}>{previewTooltip}</Box>
            )}
            {props.hotspotPath.length > 1 && (
              <Tooltip title="Back" placement="top">
                <IconButton
                  onClick={() => {
                    void confirmBack();
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Close" placement="top">
              <IconButton
                onClick={() => {
                  void confirmClose();
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>

        <Stack direction="row">
          {previewData && (
            <DialogContent sx={{ paddingTop: 0 }}>
              <HotspotContent
                hotspot={previewData}
                openNestedHotspot={openNestedHotspot}
              />
            </DialogContent>
          )}
          {props.onUpdateHotspot !== undefined && (
            <Box
              padding="20px 24px"
              borderColor={colors.grey[300]}
              sx={
                previewData && {
                  backgroundColor: "#FDFDFD",
                  borderStyle: "solid",
                  borderWidth: "1px 0 0 1px",
                  borderTopLeftRadius: "4px",
                }
              }
            >
              <HotspotEditor
                edited={edited}
                setEdited={setEdited}
                previewTooltip={previewTooltip}
                setPreviewTooltip={setPreviewTooltip}
                previewData={previewData}
                setPreviewData={setPreviewData}
                resetHotspot={resetHotspot}
                deleteHotspot={deleteHotspot}
                updateHotspot={updateHotspot}
                openNestedHotspot={openNestedHotspot}
              />
            </Box>
          )}
        </Stack>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== null}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarMessage(null);
        }}
        color="primary"
        action={
          <Tooltip title="Close" placement="top">
            <IconButton
              color="inherit"
              onClick={() => {
                setSnackbarMessage(null);
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        }
      />
    </>
  );
}

export default PopOver;
