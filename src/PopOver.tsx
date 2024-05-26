import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ArrowBack, Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  colors,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

import { Hotspot2D, HotspotData } from "./DataStructures";
import HotspotEditor from "./HotspotEditor";
import { confirmMUI } from "./StyledConfirmWrapper";

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
            <Tooltip key={hotspot2D.id} title={hotspot2D.tooltip}>
              <Box
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
            </Tooltip>
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
          style={{
            width: "50vh",
            height: "150px",
            marginTop: 3,
            borderRadius: 5,
          }}
          showSkipControls={false}
          showJumpControls={false}
          showDownloadProgress={false}
          src={props.hotspot.src.path}
        />
      );
    case "Doc": {
      const docs = [{ uri: props.hotspot.src.path }];
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
            src={props.hotspot.url}
          />
        </Box>
      );
    case "Message":
      return (
        <Box width={"20vw"} maxHeight={"70vh"}>
          <Typography>{props.hotspot.content}</Typography>
        </Box>
      );
    case "PhotosphereLink":
      break;
    default:
      break;
  }
}

export interface PopOverProps {
  hotspotPath: string[];
  tooltip: string;
  hotspotData: HotspotData;
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
  const [previewTooltip, setPreviewTooltip] = useState(props.tooltip);
  const [previewData, setPreviewData] = useState<HotspotData | null>(
    props.hotspotData,
  );

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

  async function resetHotspot() {
    if (edited && (await keepChanges())) {
      return;
    }

    setPreviewData(props.hotspotData);
    setEdited(false);
  }

  function deleteHotspot() {
    props.onUpdateHotspot?.(props.hotspotPath, previewTooltip, null);
  }

  function updateHotspot(newTooltip: string, newData: HotspotData | null) {
    props.onUpdateHotspot?.(props.hotspotPath, newTooltip, newData);
  }

  return (
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
        <Stack direction="row" alignItems="center">
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

      <Stack direction="row">
        {previewData && (
          <DialogContent>
            <HotspotContent
              hotspot={previewData}
              pushHotspot={props.pushHotspot}
              popHotspot={props.popHotspot}
              arrayLength={props.hotspotPath.length}
            />
          </DialogContent>
        )}
        {props.onUpdateHotspot !== undefined && (
          <Box
            padding="20px 24px"
            bgcolor="#FDFDFD"
            borderColor={colors.grey[300]}
            sx={{
              borderStyle: "solid",
              borderWidth: "1px 0 0 1px",
              borderTopLeftRadius: "4px",
            }}
          >
            <HotspotEditor
              edited={edited}
              setEdited={setEdited}
              previewTooltip={previewTooltip}
              setPreviewTooltip={setPreviewTooltip}
              previewData={previewData}
              setPreviewData={setPreviewData}
              openNestedHotspot={props.pushHotspot}
              resetHotspot={resetHotspot}
              deleteHotspot={deleteHotspot}
              updateHotspot={updateHotspot}
            />
          </Box>
        )}
      </Stack>
    </Dialog>
  );
}

export default PopOver;
