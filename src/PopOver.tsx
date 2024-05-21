import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {
  ArrowBack,
  Article,
  Audiotrack,
  Close,
  Delete,
  Image,
  Title,
  Videocam,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

import { Hotspot2D, HotspotData } from "./DataStructures";
import { HotspotDataEditor } from "./buttons/AddHotspot";

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
            <Tooltip key={hotspot2D.tooltip} title={hotspot2D.tooltip}>
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
          style={{ width: "50vh", maxHeight: "70vh" }}
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
            src={props.hotspot.src}
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

function HotspotIcon(props: { hotspotData: HotspotData; color: string }) {
  const iconProps = { color: props.color };

  switch (props.hotspotData.tag) {
    case "Image":
      return <Image sx={iconProps} />;
    case "Audio":
      return <Audiotrack sx={iconProps} />;
    case "Video":
      return <Videocam sx={iconProps} />;
    case "Doc":
      return <Article sx={iconProps} />;
    case "URL":
      return <Link sx={iconProps} />;
    case "Message":
      return <Title sx={iconProps} />;
    case "PhotosphereLink":
      return <></>;
  }
}

export interface HotspotEditorProps {
  hotspotPath: string[];
  tooltip: string;
  hotspotData: HotspotData;
  onUpdateHotspot: (
    hotspotPath: string[],
    tooltip: string,
    newData: HotspotData | null,
  ) => void;
  pushHotspot: (add: Hotspot2D) => void;
}

function HotspotEditor({
  hotspotPath,
  tooltip,
  hotspotData,
  onUpdateHotspot,
}: HotspotEditorProps) {
  const [newTooltip, setNewTooltip] = useState<string>(tooltip);
  const [newData, setNewData] = useState<HotspotData | null>(hotspotData);

  return (
    <Stack gap={2} width="300px">
      <Stack alignItems="center">
        <Typography variant="h5">Edit Hotspot</Typography>
      </Stack>
      <TextField
        label="Tooltip"
        value={newTooltip}
        onChange={(e) => {
          setNewTooltip(e.target.value);
        }}
      />
      <HotspotDataEditor
        hotspotData={newData}
        setHotspotData={(data) => {
          setNewData(data);
        }}
      />
      {hotspotData.tag === "Image" && (
        <>
          <Stack alignItems="center">
            <Typography variant="h6">Nested Hotspots</Typography>
          </Stack>

          <Stack gap={2} overflow="hidden" flexGrow={1} paddingBottom={1}>
            {Object.values(hotspotData.hotspots).length > 0 &&
              Object.values(hotspotData.hotspots).map((hotspot2D) => (
                <Paper key={hotspot2D.id}>
                  <Box paddingInline={2} paddingBlock={1}>
                    <Stack direction="row" gap={2} alignItems="center">
                      <HotspotIcon
                        hotspotData={hotspotData}
                        color={hotspot2D.color}
                      />
                      <Typography>{hotspot2D.tooltip}</Typography>
                      <Box flexGrow={1} />
                      <IconButton
                        size="small"
                        onClick={() => {
                          onUpdateHotspot(
                            [...hotspotPath, hotspot2D.id],
                            hotspot2D.tooltip,
                            null,
                          );
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              ))}
          </Stack>

          <Button>Add Nested Hotspot</Button>
        </>
      )}

      <Stack direction="row" gap={1.5}>
        <Button
          variant="outlined"
          color="error"
          sx={{ width: "50%" }}
          onClick={() => {
            onUpdateHotspot(hotspotPath, newTooltip, null);
          }}
        >
          Delete Hotspot
        </Button>

        <Button
          variant="contained"
          sx={{ width: "50%" }}
          onClick={() => {
            onUpdateHotspot(hotspotPath, newTooltip, newData);
          }}
        >
          Update Hotspot
        </Button>
      </Stack>
    </Stack>
  );
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
    tooltip: string,
    newData: HotspotData | null,
  ) => void;
}

function PopOver(props: PopOverProps) {
  return (
    <Dialog
      open={true}
      onClose={props.closeAll}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={false}
      scroll="body"
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" alignItems="center">
          {props.hotspotData.tag == "URL" ? (
            <Box flexGrow={1}>
              <a href={props.hotspotData.src} target="_blank" rel="noreferrer">
                {props.tooltip}
              </a>
            </Box>
          ) : (
            <Box flexGrow={1}>{props.tooltip}</Box>
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

      <DialogContent>
        <Stack direction="row">
          <HotspotContent
            hotspot={props.hotspotData}
            pushHotspot={props.pushHotspot}
            popHotspot={props.popHotspot}
            arrayLength={props.hotspotPath.length}
          />
          {props.onUpdateHotspot !== undefined && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ marginInline: 1.5 }}
              />
              <HotspotEditor
                hotspotPath={props.hotspotPath}
                tooltip={props.tooltip}
                hotspotData={props.hotspotData}
                onUpdateHotspot={props.onUpdateHotspot}
                pushHotspot={props.pushHotspot}
              />
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default PopOver;
