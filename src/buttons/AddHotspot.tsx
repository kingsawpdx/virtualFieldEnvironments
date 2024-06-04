import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";

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

import {
  Asset,
  Hotspot3D,
  HotspotData,
  calculateImageDimensions,
  newID,
} from "../DataStructures.ts";
import { alertMUI } from "../StyledDialogWrapper.tsx";

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

interface ContentInputProps {
  contentType: string;
  content: string;
  question: string;
  answer: string;
  onUpdate: (content: string, question: string, answer: string) => void;
}

function ContentInput({
  contentType,
  content,
  question,
  answer,
  onUpdate,
}: ContentInputProps) {
  const [contentFile, setContentFile] = useState<File | null>(null); // for MuiFileInput

  useEffect(() => {
    setContentFile(null);
  }, [contentType]);

  function handleFileChange(file: File | null) {
    if (file) {
      setContentFile(file);
      onUpdate(URL.createObjectURL(file), question, answer);
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
            onUpdate(e.target.value, question, answer);
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
            onUpdate(e.target.value, question, answer);
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
            onUpdate(e.target.value, question, answer);
          }}
        />
      );
    case "Quiz":
      return (
        <>
          <TextField
            required
            label="Question"
            value={question}
            onChange={(e) => {
              onUpdate(content, e.target.value, answer);
            }}
          />
          <TextField
            required
            label="Answer"
            value={answer}
            onChange={(e) => {
              onUpdate(content, question, e.target.value);
            }}
          />
        </>
      );
    default:
      return <Typography>Please select a valid content type</Typography>;
  }
}

function getHotspotDataContent(data: HotspotData | null): string {
  switch (data?.tag) {
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
    case "Quiz":
    default:
      return "";
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
  const [question, setQuestion] = useState(
    hotspotData?.tag === "Quiz" ? hotspotData.question : "",
  );
  const [answer, setAnswer] = useState(
    hotspotData?.tag === "Quiz" ? hotspotData.answer : "",
  );

  useEffect(() => {
    if (hotspotData) {
      setContentType(hotspotData.tag);
      setContent(getHotspotDataContent(hotspotData));
      setQuestion(hotspotData.tag === "Quiz" ? hotspotData.question : "");
      setAnswer(hotspotData.tag === "Quiz" ? hotspotData.answer : "");
    }
  }, [hotspotData]);

  async function updateData(
    newContentType: string,
    newContent: string,
    newQuestion: string,
    newAnswer: string,
  ) {
    setContentType(newContentType);
    setContent(newContent);
    setQuestion(newQuestion);
    setAnswer(newAnswer);

    switch (newContentType) {
      case "Message":
        // Only message hotspots can have no content.
        break;

      case "Image":
      case "Video":
      case "Audio":
      case "Doc":
      case "URL":
      case "PhotosphereLink":
        if (newContent.trim() === "") {
          setHotspotData(null);
          return;
        }
        break;

      case "Quiz":
        if (newQuestion.trim() === "" || newAnswer.trim() === "") {
          setHotspotData(null);
          return;
        }
        break;
    }

    let data: HotspotData | null = null;
    switch (newContentType) {
      case "Image": {
        const { width, height } = await calculateImageDimensions(newContent);
        data = {
          tag: "Image",
          src: { tag: "Runtime", id: newID(), path: newContent },
          width,
          height,
          hotspots: hotspotData?.tag === "Image" ? hotspotData.hotspots : {},
        };
        break;
      }
      case "Video":
        data = {
          tag: "Video",
          src: { tag: "Runtime", id: newID(), path: newContent },
        };
        break;
      case "Audio":
        data = {
          tag: "Audio",
          src: { tag: "Runtime", id: newID(), path: newContent },
        };
        break;
      case "Doc":
        data = {
          tag: "Doc",
          src: { tag: "Runtime", id: newID(), path: newContent },
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
      case "Quiz":
        data = {
          tag: "Quiz",
          question: newQuestion,
          answer: newAnswer,
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
            void updateData(e.target.value, "", "", "");
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
          <MenuItem value="Quiz">Quiz</MenuItem>
        </Select>
      </FormControl>
      <ContentInput
        contentType={contentType}
        content={content}
        question={question}
        answer={answer}
        onUpdate={(newContent, newQuestion, newAnswer) => {
          void updateData(contentType, newContent, newQuestion, newAnswer);
        }}
      />
    </>
  );
}

const bluePin = "/pin-blue.png";
const redPin = "/pin-red.png";

function defaultIcon(): Asset {
  return { tag: "Runtime", id: newID(), path: bluePin };
}

function isDefaultIcon(icon: Asset | null): boolean {
  return icon?.path === bluePin || icon?.path === redPin;
}

export interface HotspotIconEditorProps {
  iconAsset: Asset | null;
  setIconAsset: (icon: Asset | null) => void;
}

export function HotspotIconEditor({
  iconAsset,
  setIconAsset,
}: HotspotIconEditorProps) {
  function updateIcon(icon: string) {
    if (icon === "" || icon === "custom") {
      setIconAsset(null);
      return;
    }

    setIconAsset({ tag: "Runtime", id: newID(), path: icon });
  }

  return (
    <>
      <FormControl>
        <InputLabel id="icon">Icon *</InputLabel>
        <Select
          labelId="icon"
          value={isDefaultIcon(iconAsset) ? iconAsset?.path : "custom"}
          label="Icon *"
          onChange={(e) => {
            updateIcon(e.target.value);
          }}
        >
          <MenuItem value="custom">Custom Link</MenuItem>
          <MenuItem value={bluePin}>Blue Icon</MenuItem>
          <MenuItem value={redPin}>Red Icon</MenuItem>
        </Select>
      </FormControl>

      {!isDefaultIcon(iconAsset) && (
        <TextField
          required
          label="Link to icon"
          value={iconAsset?.path ?? ""}
          onChange={(e) => {
            updateIcon(e.target.value);
          }}
        />
      )}
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
  const [level, setLevel] = useState(0); // State for level
  const [iconAsset, setIconAsset] = useState<Asset | null>(defaultIcon());

  async function handleAddHotspot() {
    if (
      tooltip.trim() === "" ||
      hotspotData === null ||
      (hotspotData.tag !== "PhotosphereLink" && iconAsset === null)
    ) {
      await alertMUI(
        "Please provide a tooltip, a valid content type, and an icon",
      );
      return;
    }

    const newHotspot: Hotspot3D = {
      id: newID(),
      tooltip: tooltip,
      pitch: pitch,
      yaw: yaw,
      level: level,
      icon: iconAsset ?? defaultIcon(), // store default icon for photosphere links
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
      <Stack direction="row" gap={1}>
        <TextField
          label="Pitch"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={String(pitch.toFixed(2))}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Yaw"
          InputProps={{
            readOnly: true,
          }}
          defaultValue={String(yaw.toFixed(2))}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <TextField
        required
        label="Tooltip"
        onChange={(e) => {
          setTooltip(e.target.value);
        }}
      />

      <HotspotDataEditor
        hotspotData={hotspotData}
        setHotspotData={setHotspotData}
      />

      {hotspotData?.tag !== "PhotosphereLink" && (
        <HotspotIconEditor iconAsset={iconAsset} setIconAsset={setIconAsset} />
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
      <Stack direction="row" gap={1}>
        <Button variant="outlined" sx={{ flexGrow: 1 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ flexGrow: 1 }}
          onClick={() => {
            void handleAddHotspot();
          }}
        >
          Create
        </Button>
      </Stack>
    </Stack>
  );
}

export default AddHotspot;
