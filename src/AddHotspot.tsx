import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { Hotspot3D, HotspotData } from "./DataStructures.ts";

interface ContentInputProps {
  contentType: string;
  onChangeContent: (content: string) => void;
}

function ContentInput({ contentType, onChangeContent }: ContentInputProps) {
  const [contentFile, setContentFile] = useState<File | null>(null); // for MuiFileInput

  function handleFileChange(file: File | null) {
    if (file) {
      setContentFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const fileURL = reader.result as string;
        onChangeContent(fileURL);
      };
      reader.readAsDataURL(file);
    }
    return;
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
        <TextField
          required
          label="Content"
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
    case "URL":
      return (
        <TextField
          required
          label="URL"
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
    case "PhotosphereLink":
      return (
        <TextField
          required
          label="Photosphere ID"
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
    default:
      return <Typography>Please select a valid content type</Typography>;
  }
}
interface AddHotspotProps {
  onAddHotspot: (newHotspot: Hotspot3D) => void;
  onCancel: () => void;
  pitch: number;
  yaw: number;
}

function AddHotspot({ onAddHotspot, onCancel, pitch, yaw }: AddHotspotProps) {
  const [tooltip, setTooltip] = useState("");
  const [contentType, setContentType] = useState("invalid");
  const [content, setContent] = useState("");

  function handleAddHotspot() {
    if (tooltip.trim() == "" || contentType == "invalid") {
      alert("Please provide a tooltip and a valid content type");
      return;
    }

    let data: HotspotData;
    switch (contentType) {
      case "Image":
        data = {
          tag: "Image",
          src: content,
          hotspots: {},
        };
        break;
      case "Video":
        data = {
          tag: "Video",
          src: content,
        };
        break;
      case "Audio":
        data = {
          tag: "Audio",
          src: content,
        };
        break;
      case "Doc":
        data = {
          tag: "Doc",
          content: content,
        };
        break;
      case "URL":
        data = {
          tag: "URL",
          src: content,
        };
        break;
      case "PhotosphereLink":
        data = {
          tag: "PhotosphereLink",
          photosphereID: content,
        };
        break;
      // should never actually get here
      default:
        data = { tag: "URL", src: content };
        break;
    }

    const newHotspot: Hotspot3D = {
      pitch: pitch,
      yaw: yaw,
      tooltip: tooltip,
      data: data,
    };

    onAddHotspot(newHotspot);
  }

  return (
    <Box
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
      }}
    >
      <Typography variant="h3">Add a Hotspot</Typography>
      <Typography>Click on viewer for pitch and yaw</Typography>
      <TextField
        label="Pitch"
        InputProps={{
          readOnly: true,
        }}
        defaultValue={String(pitch.toFixed(2))}
      />
      <TextField
        label="Yaw"
        InputProps={{
          readOnly: true,
        }}
        defaultValue={String(yaw.toFixed(2))}
      />
      <TextField
        label="tooltip"
        onChange={(e) => {
          setTooltip(e.target.value);
        }}
      />
      <FormControl>
        <InputLabel id="contentType">Content Type</InputLabel>
        <Select
          labelId="contentType"
          value={contentType}
          label="Content Type"
          onChange={(e) => {
            setContentType(e.target.value);
          }}
        >
          <MenuItem value="invalid">-- Select --</MenuItem>
          <MenuItem value="Image">Image</MenuItem>
          <MenuItem value="Video">Video</MenuItem>
          <MenuItem value="Audio">Audio</MenuItem>
          <MenuItem value="URL">URL</MenuItem>
          <MenuItem value="Doc">Document</MenuItem>
          <MenuItem value="PhotosphereLink">Photosphere Link</MenuItem>
        </Select>
      </FormControl>
      <ContentInput contentType={contentType} onChangeContent={setContent} />
      <Button style={{ width: "40%" }} onClick={handleAddHotspot}>
        Create
      </Button>
      <Button style={{ width: "40%" }} onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
}

export default AddHotspot;
