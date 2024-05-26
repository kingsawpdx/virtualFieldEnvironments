import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";

import {
  Hotspot3D,
  HotspotData,
  calculateImageDimensions,
  newID,
} from "../DataStructures.ts";

interface ContentInputProps {
  contentType: string;
  content: string;
  onChangeContent: (content: string) => void;
}

// from https://github.com/Alcumus/react-doc-viewer?tab=readme-ov-file#current-renderable-file-types
const documentAcceptTypes = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/htm",
  "text/html",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function ContentInput({
  contentType,
  content,
  onChangeContent,
}: ContentInputProps) {
  const [contentFile, setContentFile] = useState<File | null>(null); // for MuiFileInput

  useEffect(() => {
    setContentFile(null);
  }, [contentType]);

  function handleFileChange(file: File | null) {
    if (file) {
      setContentFile(file);
      onChangeContent(URL.createObjectURL(file));
    }
  }

  switch (contentType) {
    case "Image":
      return (
        <MuiFileInput
          required
          placeholder="Upload Image *"
          value={contentFile}
          onChange={handleFileChange}
          inputProps={{ accept: "image/*" }}
          InputProps={{
            startAdornment: <AttachFileIcon />,
          }}
        />
      );
    case "Video":
      return (
        <MuiFileInput
          required
          placeholder="Upload Video *"
          value={contentFile}
          onChange={handleFileChange}
          inputProps={{ accept: "video/*" }}
          InputProps={{
            startAdornment: <AttachFileIcon />,
          }}
        />
      );
    case "Audio":
      return (
        <MuiFileInput
          required
          placeholder="Upload Audio *"
          value={contentFile}
          onChange={handleFileChange}
          inputProps={{ accept: "audio/*" }}
          InputProps={{
            startAdornment: <AttachFileIcon />,
          }}
        />
      );
    case "Doc":
      return (
        <MuiFileInput
          required
          placeholder="Upload Document *"
          value={contentFile}
          onChange={handleFileChange}
          inputProps={{
            accept: documentAcceptTypes.join(", "),
          }}
          InputProps={{
            startAdornment: <AttachFileIcon />,
          }}
        />
      );
    case "URL":
      return (
        <TextField
          required
          label="URL"
          value={content}
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
    case "Message":
      return (
        <TextField
          required
          label="Message"
          value={content}
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
          multiline
        />
      );
    case "PhotosphereLink":
      return (
        <TextField
          required
          label="Photosphere ID"
          value={content}
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
    default:
      return <Typography>Please select a valid content type</Typography>;
  }
}

function getHotspotDataContent(data: HotspotData | null): string {
  if (data === null) return "";

  switch (data.tag) {
    case "Image":
    case "Audio":
    case "Video":
    case "Doc":
      return data.src.path;
    case "URL":
      return data.url;
    case "Message":
      return data.content;
    case "PhotosphereLink":
      return data.photosphereID;
  }
}

export interface HotspotDataEditorProps {
  hotspotData: HotspotData | null;
  setHotspotData: (data: HotspotData | null) => void;
}

export function HotspotDataEditor({
  hotspotData,
  setHotspotData,
}: HotspotDataEditorProps) {
  const [contentType, setContentType] = useState<string>(
    hotspotData?.tag ?? "invalid",
  );
  const [content, setContent] = useState<string>(
    getHotspotDataContent(hotspotData),
  );

  useEffect(() => {
    if (hotspotData) {
      setContentType(hotspotData.tag);
      setContent(getHotspotDataContent(hotspotData));
    }
  }, [hotspotData]);

  async function updateData(newContentType: string, newContent: string) {
    setContentType(newContentType);
    setContent(newContent);

    // Only message hotspots can have no content.
    if (newContent.trim() === "" && newContentType !== "Message") {
      setHotspotData(null);
      return;
    }

    let data: HotspotData | null = null;
    switch (newContentType) {
      case "Image": {
        const { width, height } = await calculateImageDimensions(newContent);
        data = {
          tag: "Image",
          src: { tag: "Network", path: newContent },
          width,
          height,
          hotspots: hotspotData?.tag === "Image" ? hotspotData.hotspots : {},
        };
        break;
      }
      case "Video":
        data = {
          tag: "Video",
          src: { tag: "Network", path: newContent },
        };
        break;
      case "Audio":
        data = {
          tag: "Audio",
          src: { tag: "Network", path: newContent },
        };
        break;
      case "Doc":
        data = {
          tag: "Doc",
          src: { tag: "Network", path: newContent },
        };
        break;
      case "URL":
        data = {
          tag: "URL",
          url: newContent,
        };
        break;
      case "Message":
        data = {
          tag: "Message",
          content: newContent,
        };
        break;
      case "PhotosphereLink":
        data = {
          tag: "PhotosphereLink",
          photosphereID: newContent,
        };
        break;
    }

    setHotspotData(data);
  }

  return (
    <>
      <FormControl>
        <InputLabel id="contentType">Content Type</InputLabel>
        <Select
          labelId="contentType"
          value={contentType}
          label="Content Type"
          onChange={(e) => {
            void updateData(e.target.value, "");
          }}
        >
          <MenuItem value="invalid">-- Select --</MenuItem>
          <MenuItem value="Image">Image</MenuItem>
          <MenuItem value="Video">Video</MenuItem>
          <MenuItem value="Audio">Audio</MenuItem>
          <MenuItem value="Doc">Document</MenuItem>
          <MenuItem value="URL">URL</MenuItem>
          <MenuItem value="Message">Message</MenuItem>
          <MenuItem value="PhotosphereLink">Photosphere Link</MenuItem>
        </Select>
      </FormControl>
      <ContentInput
        contentType={contentType}
        content={content}
        onChangeContent={(newContent) => {
          void updateData(contentType, newContent);
        }}
      />
    </>
  );
}

interface AddHotspotProps {
  onAddHotspot: (newHotspot: Hotspot3D) => void;
  onCancel: () => void;
  pitch: number;
  yaw: number;
}

function AddHotspot({ onAddHotspot, onCancel, pitch, yaw }: AddHotspotProps) {
  const [tooltip, setTooltip] = useState("");
  const [hotspotData, setHotspotData] = useState<HotspotData | null>(null);

  function handleAddHotspot() {
    if (tooltip.trim() == "" || hotspotData === null) {
      alert("Please provide a tooltip and a valid content type");
      return;
    }

    const newHotspot: Hotspot3D = {
      pitch: pitch,
      yaw: yaw,
      id: newID(),
      tooltip: tooltip,
      data: hotspotData,
    };

    onAddHotspot(newHotspot);
  }

  return (
    <Stack
      sx={{
        position: "absolute",
        zIndex: 1000,
        right: "20px",
        top: "20px",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "8px",
        padding: "10px",
        justifyContent: "space-between",
        height: "360px",
        width: "275px",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Add a Hotspot
      </Typography>
      <Typography>Click on viewer for pitch and yaw</Typography>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <TextField
          label="Pitch"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={String(pitch.toFixed(2))}
          sx={{ width: "49%" }}
        />
        <TextField
          label="Yaw"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={String(yaw.toFixed(2))}
          sx={{ width: "49%" }}
        />
      </Stack>
      <TextField
        label="Tooltip"
        onChange={(e) => {
          setTooltip(e.target.value);
        }}
      />
      <HotspotDataEditor
        hotspotData={hotspotData}
        setHotspotData={setHotspotData}
      />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          style={{ width: "49%" }}
          onClick={handleAddHotspot}
        >
          Create
        </Button>
        <Button variant="outlined" sx={{ width: "49%" }} onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

export default AddHotspot;
