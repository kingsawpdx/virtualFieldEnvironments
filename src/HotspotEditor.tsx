import {
  Add,
  Article,
  Audiotrack,
  ExpandLess,
  ExpandMore,
  Image,
  Title,
  Videocam,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  lighten,
} from "@mui/material";
import Box from "@mui/material/Box";
import { forwardRef, useState } from "react";
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

function newBlankHotspot(): Hotspot2D {
  return {
    x: 50,
    y: 50,
    id: newID(),
    tooltip: "New Hotspot",
    color: "#FF0000",
    data: { tag: "Message", content: "New Hotspot Content" },
  };
}

export interface NestedHotspotBoxProps {
  hotspot: Hotspot2D;
  onClick?: () => void;
}

export const NestedHotspotBox = forwardRef<HTMLElement, NestedHotspotBoxProps>(
  function NestedHotspotBox(props, ref) {
    const { hotspot, onClick, ...otherProps } = props;

    return (
      <Box
        {...otherProps}
        ref={ref}
        onClick={onClick}
        position="absolute"
        left={`${hotspot.x}%`}
        top={`${hotspot.y}%`}
        width={50}
        height={50}
        border={"5px solid"}
        borderColor={alpha(hotspot.color, 0.75)}
        sx={{
          transform: "translate(-50%, -50%)",
          pointerEvents: onClick ? "unset" : "none",
          "&:hover": onClick && {
            borderColor: lighten(hotspot.color, 0.5),
            backgroundColor: alpha(hotspot.color, 0.25),
          },
        }}
      />
    );
  },
);

interface HotspotColorPickerProps {
  anchor: HTMLElement;
  hotspot: Hotspot2D;
  onChange: (hotspot: Hotspot2D) => void;
  onClose: () => void;
}

function HotspotColorPicker({
  anchor,
  hotspot,
  onChange,
  onClose,
}: HotspotColorPickerProps) {
  function updateHotspot(color: string) {
    onChange({ ...hotspot, color });
  }

  return (
    <Popover
      anchorEl={anchor}
      open={true}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onClose={onClose}
    >
      <Box padding="3px">
        <HexColorPicker color={hotspot.color} onChange={updateHotspot} />
      </Box>
    </Popover>
  );
}

interface HotspotLocationPickerProps {
  image: string;
  hotspot: Hotspot2D;
  onSave: (hotspot: Hotspot2D) => void;
  onClose: () => void;
}

function HotspotLocationPicker({
  image,
  hotspot,
  onSave,
  onClose,
}: HotspotLocationPickerProps) {
  const [previewHotspot, setPreviewHotspot] = useState(hotspot);

  function updateHotspot() {
    onSave(previewHotspot);
    onClose();
  }

  function offsetPercent(value: number, max: number) {
    return Math.floor((value / max) * 100);
  }

  function handleMouseClick(event: React.MouseEvent) {
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = offsetPercent(event.clientX - rect.left, rect.width);
    const y = offsetPercent(event.clientY - rect.top, rect.height);

    setPreviewHotspot({ ...previewHotspot, x, y });
  }

  function handleMouseMove(event: React.MouseEvent) {
    // Only update when mouse button is pressed.
    if (event.buttons === 1) {
      handleMouseClick(event);
    }
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth={false}>
      <DialogTitle>Choose Hotspot Location</DialogTitle>
      <DialogContent>
        <Box position="relative" overflow="hidden">
          <NestedHotspotBox hotspot={previewHotspot} />
          <img
            onClick={handleMouseClick}
            onMouseMove={handleMouseMove}
            draggable={false}
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "60vh",
              objectFit: "contain",
              borderRadius: "4px",
              userSelect: "none",
            }}
            src={image}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={updateHotspot}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

interface HotspotCardProps {
  hotspot: Hotspot2D;
  edited: boolean;
  setColorAnchor: (anchor: HTMLElement | null) => void;
  setColorHotspot: (hotspot: Hotspot2D | null) => void;
  setLocationHotspot: (hotspot: Hotspot2D | null) => void;
  removeNestedHotspot: (hotspotID: string) => void;
  openNestedHotspot: (hotspot: Hotspot2D) => void;
}

function HotspotCard({
  hotspot,
  edited,
  setColorAnchor,
  setColorHotspot,
  setLocationHotspot,
  removeNestedHotspot,
  openNestedHotspot,
}: HotspotCardProps) {
  const [expandedHotspotID, setExpandedHotspotID] = useState<string | null>(
    null,
  );

  function toggleExpanded(hotspotID: string) {
    if (expandedHotspotID === hotspotID) {
      setExpandedHotspotID(null);
    } else {
      setExpandedHotspotID(hotspotID);
    }
  }

  return (
    <Card key={hotspot.id}>
      <CardHeader
        title={hotspot.tooltip}
        titleTypographyProps={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          onClick: () => {
            toggleExpanded(hotspot.id);
          },
          sx: {
            cursor: "pointer",
          },
        }}
        avatar={
          <Tooltip title="Change Color">
            <IconButton
              size="small"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                setColorAnchor(e.currentTarget);
                setColorHotspot(hotspot);
              }}
            >
              <HotspotIcon hotspotData={hotspot.data} color={hotspot.color} />
            </IconButton>
          </Tooltip>
        }
        action={
          <IconButton
            size="small"
            onClick={() => {
              toggleExpanded(hotspot.id);
            }}
          >
            {expandedHotspotID === hotspot.id ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
        sx={{
          padding: 1,
          overflow: "hidden",
          "& .MuiCardHeader-action": {
            margin: 0,
          },
        }}
      />

      <Collapse in={expandedHotspotID === hotspot.id}>
        <CardActions>
          <Box flexGrow={1} />

          <Button
            color="error"
            size="small"
            onClick={() => {
              removeNestedHotspot(hotspot.id);
            }}
          >
            Delete
          </Button>

          <Button
            size="small"
            onClick={() => {
              setLocationHotspot(hotspot);
            }}
          >
            Move
          </Button>

          <Button
            disabled={edited}
            size="small"
            onClick={() => {
              openNestedHotspot(hotspot);
            }}
          >
            Edit
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
}

export interface HotspotEditorProps {
  edited: boolean;
  setEdited: (edited: boolean) => void;
  previewTooltip: string;
  setPreviewTooltip: (tooltip: string) => void;
  previewData: HotspotData | null;
  setPreviewData: (data: HotspotData | null) => void;

  resetHotspot: () => Promise<void>;
  deleteHotspot: () => void;
  updateHotspot: (newTooltip: string, newData: HotspotData) => void;
  openNestedHotspot: (toOpen: Hotspot2D) => void;
}

function HotspotEditor({
  edited,
  setEdited,
  previewTooltip,
  setPreviewTooltip,
  previewData,
  setPreviewData,

  resetHotspot,
  deleteHotspot,
  updateHotspot,
  openNestedHotspot,
}: HotspotEditorProps) {
  const [hotspotsCollapsed, setHotspotsCollapsed] = useState(false);

  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [colorHotspot, setColorHotspot] = useState<Hotspot2D | null>(null);
  const [locationHotspot, setLocationHotspot] = useState<Hotspot2D | null>(
    null,
  );

  const nestedHotspotLength =
    previewData?.tag === "Image"
      ? Object.values(previewData.hotspots).length
      : 0;

  function removeNestedHotspot(hotspotID: string) {
    if (previewData?.tag === "Image") {
      const { [hotspotID]: _removed, ...remainingHotspots } =
        previewData.hotspots;

      setPreviewData({
        ...previewData,
        hotspots: remainingHotspots,
      });
      setEdited(true);
    }
  }

  function updateNestedHotspot(updatedHotspot: Hotspot2D) {
    if (previewData?.tag === "Image") {
      setPreviewData({
        ...previewData,
        hotspots: {
          ...previewData.hotspots,
          [updatedHotspot.id]: updatedHotspot,
        },
      });
      setHotspotsCollapsed(false);
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
        setHotspotData={(data) => {
          setPreviewData(data);
          setEdited(true);
        }}
      />
      {previewData?.tag === "Image" && (
        <>
          {colorHotspot !== null && colorAnchor !== null && (
            <HotspotColorPicker
              anchor={colorAnchor}
              hotspot={colorHotspot}
              onChange={(updatedHotspot) => {
                updateNestedHotspot(updatedHotspot);
              }}
              onClose={() => {
                setColorHotspot(null);
                setColorAnchor(null);
              }}
            />
          )}

          {locationHotspot !== null && (
            <HotspotLocationPicker
              image={previewData.src.path}
              hotspot={locationHotspot}
              onSave={(updatedHotspot) => {
                updateNestedHotspot(updatedHotspot);
              }}
              onClose={() => {
                setLocationHotspot(null);
              }}
            />
          )}

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
                    setLocationHotspot(newBlankHotspot());
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </Stack>

            {!hotspotsCollapsed &&
              nestedHotspotLength > 0 &&
              Object.values(previewData.hotspots).map((hotspot2D) => (
                <HotspotCard
                  key={hotspot2D.id}
                  hotspot={hotspot2D}
                  edited={edited}
                  setColorAnchor={setColorAnchor}
                  setColorHotspot={setColorHotspot}
                  setLocationHotspot={setLocationHotspot}
                  removeNestedHotspot={removeNestedHotspot}
                  openNestedHotspot={openNestedHotspot}
                />
              ))}
          </Stack>
        </>
      )}

      <Box flexGrow={1} />
      {edited && (
        <Button
          onClick={() => {
            void resetHotspot();
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
          onClick={deleteHotspot}
        >
          Delete Hotspot
        </Button>

        <Button
          disabled={previewTooltip == "" || previewData === null}
          variant="contained"
          sx={{ width: "50%" }}
          onClick={() => {
            if (previewData !== null) {
              updateHotspot(previewTooltip, previewData);
            }
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

export default HotspotEditor;
