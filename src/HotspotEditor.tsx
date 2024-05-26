import {
  Add,
  Article,
  Audiotrack,
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
  IconButton,
  Link,
  Paper,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import "react-h5-audio-player/lib/styles.css";

import { Hotspot2D, HotspotData, newID } from "./DataStructures";
import { HotspotDataEditor } from "./buttons/AddHotspot";

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
  initialTooltip: string;
  initialData: HotspotData;

  previewTooltip: string;
  setPreviewTooltip: (tooltip: string) => void;

  previewData: HotspotData | null;
  setPreviewData: (data: HotspotData | null) => void;

  onUpdateHotspot: (
    hotspotPath: string[],
    tooltip: string,
    newData: HotspotData | null,
  ) => void;
  pushHotspot: (add: Hotspot2D) => void;
}

function HotspotEditor({
  hotspotPath,
  initialTooltip,
  initialData,

  previewTooltip,
  setPreviewTooltip,

  previewData,
  setPreviewData,

  onUpdateHotspot,
  pushHotspot,
}: HotspotEditorProps) {
  const [edited, setEdited] = useState(false);

  const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
  const [popperHotspot, setPopperHotspot] = useState<Hotspot2D | null>(null);

  const [hotspotsCollapsed, setHotspotsCollapsed] = useState(false);
  const [nestedHotspotLength, setNestedHotspotLength] = useState(
    initialData.tag === "Image"
      ? Object.values(initialData.hotspots).length
      : 0,
  );

  useEffect(() => {
    if (previewData?.tag === "Image") {
      setNestedHotspotLength(Object.values(previewData.hotspots).length);
    }
  }, [previewData]);

  function removeNestedHotspot(hotspotToRemove: string) {
    if (previewData?.tag === "Image") {
      const { [hotspotToRemove]: _removed, ...remainingHotspots } =
        previewData.hotspots;

      setPreviewData({
        ...previewData,
        hotspots: remainingHotspots,
      });
      setEdited(true);
    }
  }

  function addNestedHotspot() {
    if (previewData?.tag === "Image") {
      const newHotspot: Hotspot2D = {
        x: 0,
        y: 0,
        id: newID(),
        tooltip: "New Hotspot",
        color: "#FF0000",
        data: { tag: "Message", content: "New Hotspot Content" },
      };

      setPreviewData({
        ...previewData,
        hotspots: { ...previewData.hotspots, [newHotspot.id]: newHotspot },
      });
      setEdited(true);
    }
  }

  function changeNestedHotspotColor(hotspotToChange: string, color: string) {
    if (previewData?.tag === "Image") {
      const updatedHotspot = {
        ...previewData.hotspots[hotspotToChange],
        color,
      };

      setPreviewData({
        ...previewData,
        hotspots: {
          ...previewData.hotspots,
          [updatedHotspot.id]: updatedHotspot,
        },
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
        value={previewTooltip}
        onChange={(e) => {
          setPreviewTooltip(e.target.value);
        }}
      />
      <HotspotDataEditor
        hotspotData={previewData}
        setHotspotData={setPreviewData}
      />
      {previewData?.tag === "Image" && (
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
            Object.values(previewData.hotspots).map((hotspot2D) => (
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
            setPreviewTooltip(initialTooltip);
            setPreviewData(initialData);
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
            onUpdateHotspot(hotspotPath, previewTooltip, null);
          }}
        >
          Delete Hotspot
        </Button>

        <Button
          variant="contained"
          sx={{ width: "50%" }}
          onClick={() => {
            onUpdateHotspot(hotspotPath, previewTooltip, previewData);
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

export default HotspotEditor;
