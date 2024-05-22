import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {
  Add,
  ArrowBack,
  Article,
  Audiotrack,
  Close,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Image,
  Title,
  Videocam,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  colors,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

import { Hotspot2D, HotspotData, newID } from "./DataStructures";
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
  pushHotspot,
}: HotspotEditorProps) {
  const [newTooltip, setNewTooltip] = useState<string>(tooltip);
  const [newData, setNewData] = useState<HotspotData | null>(hotspotData);
  const [edited, setEdited] = useState(false);

  const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
  const [popperHotspot, setPopperHotspot] = useState<Hotspot2D | null>(null);

  const [hotspotsCollapsed, setHotspotsCollapsed] = useState(false);
  const [nestedHotspotLength, setNestedHotspotLength] = useState(
    hotspotData.tag === "Image"
      ? Object.values(hotspotData.hotspots).length
      : 0,
  );

  useEffect(() => {
    if (newData?.tag === "Image") {
      setNestedHotspotLength(Object.values(newData.hotspots).length);
    }
  }, [newData]);

  function removeNestedHotspot(hotspotToRemove: string) {
    if (newData?.tag === "Image") {
      const { [hotspotToRemove]: _removed, ...remainingHotspots } =
        newData.hotspots;

      setNewData({
        ...newData,
        hotspots: remainingHotspots,
      });
      setEdited(true);
    }
  }

  function addNestedHotspot() {
    if (newData?.tag === "Image") {
      const newHotspot: Hotspot2D = {
        x: 0,
        y: 0,
        id: newID(),
        tooltip: "New Hotspot",
        color: "#FF0000",
        data: { tag: "Message", content: "New Hotspot Content" },
      };

      setNewData({
        ...newData,
        hotspots: { ...newData.hotspots, [newHotspot.id]: newHotspot },
      });
      setEdited(true);
    }
  }

  function changeNestedHotspotColor(hotspotToChange: string, color: string) {
    if (newData?.tag === "Image") {
      const updatedHotspot = { ...newData.hotspots[hotspotToChange], color };

      setNewData({
        ...newData,
        hotspots: { ...newData.hotspots, [updatedHotspot.id]: updatedHotspot },
      });
      setEdited(true);
    }
  }

  return (
    <Stack gap={2} width="300px" height="100%">
      <Stack alignItems="center">
        <Typography variant="h5">Hotspot Editor</Typography>
      </Stack>
      <TextField
        label="Tooltip"
        value={newTooltip}
        onChange={(e) => {
          setNewTooltip(e.target.value);
        }}
      />
      <HotspotDataEditor hotspotData={newData} setHotspotData={setNewData} />
      {newData?.tag === "Image" && (
        <Stack gap={1}>
          <Stack direction="row">
            {nestedHotspotLength == 0 ? (
              <Box width={32} height={32} padding="1px" />
            ) : (
              <IconButton
                size="small"
                onClick={() => {
                  setHotspotsCollapsed(!hotspotsCollapsed);
                }}
              >
                {hotspotsCollapsed ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            )}

            <Typography
              variant="h6"
              flexGrow={1}
              textAlign="center"
              onClick={() => {
                setHotspotsCollapsed(!hotspotsCollapsed);
              }}
              sx={{ cursor: nestedHotspotLength > 0 ? "pointer" : "unset" }}
            >
              {`Nested Hotspots (${nestedHotspotLength})`}
            </Typography>

            <Tooltip title="Add Hotspot">
              <IconButton
                size="small"
                onClick={() => {
                  addNestedHotspot();
                  setNestedHotspotLength(nestedHotspotLength + 1);
                  setHotspotsCollapsed(false);
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Stack>

          {!hotspotsCollapsed &&
            nestedHotspotLength > 0 &&
            Object.values(newData.hotspots).map((hotspot2D) => (
              <Paper key={hotspot2D.id}>
                <Box padding={1}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <Tooltip title="Change Color">
                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          setPopperAnchor(e.currentTarget);
                          setPopperHotspot(hotspot2D);
                        }}
                      >
                        <HotspotIcon
                          hotspotData={hotspot2D.data}
                          color={hotspot2D.color}
                        />
                      </IconButton>
                    </Tooltip>

                    <Typography
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {hotspot2D.tooltip}
                    </Typography>

                    <Box flexGrow={1} />
                    <Stack direction="row">
                      {!edited && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              pushHotspot(hotspot2D);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            removeNestedHotspot(hotspot2D.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            ))}
        </Stack>
      )}

      <Popover
        anchorEl={popperAnchor}
        open={popperAnchor !== null && popperHotspot !== null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => {
          setPopperAnchor(null);
        }}
      >
        <Box padding="3px">
          <HexColorPicker
            color={popperHotspot?.color}
            onChange={(color) => {
              if (popperHotspot) {
                changeNestedHotspotColor(popperHotspot.id, color);
              }
            }}
          />
        </Box>
      </Popover>

      <Box flexGrow={1} />
      {edited && (
        <Button
          onClick={() => {
            setNewData(hotspotData);
            setEdited(false);
          }}
        >
          Discard All Changes
        </Button>
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
          Save
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

      <Stack direction="row">
        <DialogContent>
          <HotspotContent
            hotspot={props.hotspotData}
            pushHotspot={props.pushHotspot}
            popHotspot={props.popHotspot}
            arrayLength={props.hotspotPath.length}
          />
        </DialogContent>
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
              key={props.hotspotPath.join()}
              hotspotPath={props.hotspotPath}
              tooltip={props.tooltip}
              hotspotData={props.hotspotData}
              onUpdateHotspot={props.onUpdateHotspot}
              pushHotspot={props.pushHotspot}
            />
          </Box>
        )}
      </Stack>
    </Dialog>
  );
}

export default PopOver;
