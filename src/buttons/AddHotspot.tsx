import React, { useState } from "react";

import { Hotspot3D, HotspotData } from "../DataStructures.ts";

interface ContentInputProps {
  contentType: string;
  onChangeContent: (content: string) => void;
}

function ContentInput({ contentType, onChangeContent }: ContentInputProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onChangeContent(URL.createObjectURL(file));
    }
  }

  let label;
  let input;
  switch (contentType) {
    case "Image":
    case "Video":
    case "Audio":
      label = <label htmlFor="content">Content: </label>;
      input = <input type="file" id="content" onChange={handleFileChange} />;
      break;
    case "Doc":
    case "URL":
      label = <label htmlFor="content">Content: </label>;
      input = (
        <input
          type="string"
          id="content"
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
      break;
    case "PhotosphereLink":
      label = <label htmlFor="content">Photosphere Name: </label>;
      input = (
        <input
          type="string"
          id="content"
          onChange={(e) => {
            onChangeContent(e.target.value);
          }}
        />
      );
      break;
    case "Quiz":
      label = (
        <div>
          <label htmlFor="question">Question: </label>
          <input
            type="text"
            id="question"
            onChange={(e) => {
              onChangeContent(e.target.value);
            }}
          />
        </div>
      );
      input = (
        <div style={{display:'block'}}>
          <label htmlFor="answer">Answers: </label>
          <input
            type="text"
            id="answer"
            onChange={(e) => {
              onChangeContent(e.target.value);
            }}
          />
        </div>
      );
      break;

    default:
      label = <label htmlFor="content"></label>;
      input = (
        <span id="content">First select a content type to add content</span>
      );

  }

  return (
    <>
      {label}
      {input}
    </>
  );
}
interface AddHotspotProps {
  onAddHotspot: (newHotspot: Hotspot3D) => void;
  onCancel: () => void;
  pitch: number;
  yaw: number;
  level: number;
  visited: boolean;
}

function AddHotspot({ onAddHotspot, onCancel, pitch, yaw }: AddHotspotProps) {
  const [tooltip, setTooltip] = useState("");
  const [contentType, setContentType] = useState("invalid");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(0); // State for level

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
          src: { tag: "Network", path: content },
          hotspots: {},
        };
        break;
      case "Video":
        data = {
          tag: "Video",
          src: { tag: "Network", path: content },
        };
        break;
      case "Audio":
        data = {
          tag: "Audio",
          src: { tag: "Network", path: content },
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
          question: content,
          answer: content,
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
      level: level,
      visited: false,
    };

    onAddHotspot(newHotspot);
  }

  return (
    <div
      style={{
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
      <h4 style={{ textAlign: "center" }}>Add A Hotspot</h4>
      <div>
        <label htmlFor="tooptip">Tooltip: </label>
        <input
          type="string"
          id="tooltip"
          value={tooltip}
          onChange={(e) => {
            setTooltip(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="contentType">Content Type: </label>
        <select
          name="contentType"
          id="contentType"
          onChange={(e) => {
            setContentType(e.target.value);
          }}
        >
          <option value="invalid">-- Select --</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
          <option value="Audio">Audio</option>
          <option value="URL">URL</option>
          <option value="Doc">Document</option>
          <option value="PhotosphereLink">Photosphere Link</option>
          <option value="Quiz">Quiz</option>
        </select>
      </div>
      <div>
        <ContentInput contentType={contentType} onChangeContent={setContent} />
      </div>
      <div>
        <span>Pitch: </span>
        <span id="pitch">{String(pitch.toFixed(2))}</span>
        <span>Yaw: </span>
        <span id="yaw">{String(yaw.toFixed(2))}</span>
        <br />
        <span>Click on viewer for pitch and yaw</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
      <label htmlFor="level">Level for level (optional):    </label>
        <input
          type="string"
          id="tooltip"
          value={level || ""}
          onChange={(e) => {
            setLevel(parseInt(e.target.value));
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button style={{ width: "40%" }} onClick={handleAddHotspot}>
          Create
        </button>
        <button style={{ width: "40%" }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddHotspot;
