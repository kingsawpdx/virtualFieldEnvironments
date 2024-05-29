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
import { useState } from "react";

import { Asset, Hotspot3D, HotspotData, newID } from "../DataStructures.ts";

interface ContentInputProps {
  contentType: string;
  onChangeContent: (content: string) => void;
  onChangeAnswer: (answer: string) => void;
  onChangeQuestion: (question: string) => void;
}

function ContentInput({
  contentType,
  onChangeContent,
  onChangeQuestion,
  onChangeAnswer,
}: ContentInputProps) {
  const [contentFile, setContentFile] = useState<File | null>(null); // for MuiFileInput

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
      break;
    case "Quiz":
      return (
        <>
          <TextField
            required
            label="Question"
            onChange={(e) => {
              onChangeQuestion(e.target.value);
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            required
            label="Answer"
            onChange={(e) => {
              onChangeAnswer(e.target.value);
            }}
            fullWidth
            margin="normal"
          />
        </>
      );
      break;

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
  const [level, setLevel] = useState(0); // State for level
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [icon, setIcon] = useState("");
  const [customIcon, setCustomIcon] = useState(false);
  const [customIconData, setCustomIconData] = useState("");

  function handleAddHotspot() {
    if (tooltip.trim() == "" || contentType == "invalid" || icon == "") {
      alert("Please provide a tooltip, a valid content type, and an icon");
      return;
    }

    let data: HotspotData;
    switch (contentType) {
      case "Image":
        data = {
          tag: "Image",
          src: { tag: "Runtime", id: newID(), path: content },
          hotspots: {},
        };
        break;
      case "Video":
        data = {
          tag: "Video",
          src: { tag: "Runtime", id: newID(), path: content },
        };
        break;
      case "Audio":
        data = {
          tag: "Audio",
          src: { tag: "Runtime", id: newID(), path: content },
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
      case "Quiz":
        data = {
          tag: "Quiz",
          question: question,
          answer: answer,
        };
        break;
      // should never actually get here
      default:
        data = { tag: "URL", src: content };
        break;
    }

    let iconData = "";

    if (customIconData == "") {
      iconData = icon;
    } else {
      iconData = customIconData;
    }

    const iconAsset: Asset = {
      tag: "Runtime",
      id: newID(),
      path: iconData,
    };

    const newHotspot: Hotspot3D = {
      id: tooltip,
      pitch: pitch,
      yaw: yaw,
      tooltip: tooltip,
      data: data,
      level: level,
      icon: iconAsset,
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
        flexGrow: "1",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "8px",
        padding: "10px",
        justifyContent: "space-between",
        width: "275px",
      }}
      spacing={1.2}
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
        required
        label="Tooltip"
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
          <MenuItem value="Quiz">Quiz</MenuItem>
        </Select>
      </FormControl>
      <ContentInput
        contentType={contentType}
        onChangeContent={setContent}
        onChangeAnswer={setAnswer}
        onChangeQuestion={setQuestion}
      />
      {contentType == "PhotosphereLink" ? (
        <></>
      ) : (
        <FormControl>
          <InputLabel id="icon">Icon *</InputLabel>
          <Select
            labelId="icon"
            value={icon}
            label="Custom Icon"
            onChange={(e) => {
              if (e.target.value == "custom") {
                setCustomIcon(true);
                setIcon(e.target.value);
              } else {
                setIcon(e.target.value);
                setCustomIcon(false);
                setCustomIconData("");
              }
            }}
          >
            <MenuItem value="custom">Custom Link</MenuItem>
            <MenuItem value="https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-blue.png">
              Blue Icon
            </MenuItem>
            <MenuItem value="https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png">
              Red Icon
            </MenuItem>
          </Select>
        </FormControl>
      )}

      {customIcon ? (
        <TextField
          required
          label="Link to icon"
          onChange={(e) => {
            setCustomIconData(e.target.value);
          }}
        />
      ) : (
        <></>
      )}

      <TextField
        label="Level"
        value={level || ""}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (!isNaN(newValue)) {
            setLevel(newValue);
          } else {
            setLevel(0);
          }
        }}
        fullWidth
        margin="normal"
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
