import React, { useState } from "react";

import { Hotspot3D, HotspotData, VFE } from "./DataStructures.ts";

interface AddHotspotProps {
  vfe: VFE;
}

function AddHotspot({ vfe }: AddHotspotProps) {
  // Placeholder content or logic can be added here later
  const [tooltip, setTooltip] = useState("");
  const [contentType, setContentType] = useState("invalid");
  const [content, setContent] = useState("");
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);

  function handleContentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const URL = reader.result as string;
        setContent(URL);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSelectPosition() {
    // todo
    // get pitch/yaw off of click on viewer
  }

  function handleAddHotspot() {
    if (tooltip.trim() == "" || contentType == "invalid") {
      alert("Please provide a tooltip, a valid content type, and location");
      return;
    }

    let data: HotspotData;
    switch (contentType) {
      case "Image":
        data = {
          tag: "Image",
          src: content,
          hotspots: [],
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
          photosphereID: tooltip,
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

    // todo
    // need a way to know which photosphere is current so can add hotspots in correct spot
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
        </select>
      </div>
      <div>
        <label htmlFor="content">Content: </label>
        <input type="file" id="content" onChange={handleContentChange} />
      </div>
      <div>
        {/*<span>Pitch: </span>
        <span id="pitch">{String(pitch)}</span>
        <span>Yaw: </span>
        <span id="yaw">{String(yaw)}</span>
        <br />
        <button onClick={handleSelectPosition}>Select Position</button>*/}
        <label htmlFor="pitch">Pitch: </label>
        <input
          style={{ width: 30 }}
          type="string"
          id="pitch"
          value={pitch}
          onChange={(e) => {
            setPitch(parseInt(e.target.value));
          }}
        />
        <label htmlFor="yaw">Yaw: </label>
        <input
          style={{ width: 30 }}
          type="string"
          id="yaw"
          value={yaw}
          onChange={(e) => {
            setYaw(parseInt(e.target.value));
          }}
        />
      </div>
      <button onClick={handleAddHotspot}>Create</button>
    </div>
  );
}

export default AddHotspot;
