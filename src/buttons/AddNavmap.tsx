import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";

import { NavMap, newID } from "../DataStructures";

interface AddNavMapProps {
  onCreateNavMap: (navMap: NavMap) => void;
  onClose: () => void; // Function to close the AddNavMap window
}

// Calculate image dimensions by creating an image element and waiting for it to load.
// Since image loading isn't synchronous, it needs to be wrapped in a Promise.
async function calculateImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = url;
  });
}

function AddNavMap({ onCreateNavMap, onClose }: AddNavMapProps): JSX.Element {
  const [navmapName, setNavmapName] = useState("");
  const [navmapImage, setNavmapImage] = useState<string | null>(null);
  const [navmapImgFile, setNavmapImgFile] = useState<File | null>(null); // for MuiFileInput

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNavmapName(e.target.value);
  }

  function handleImageChange(file: File | null) {
    if (file) {
      setNavmapImgFile(file);
      setNavmapImage(URL.createObjectURL(file));
    }
  }

  async function handleCreateNavMap() {
    if (navmapName.trim() === "" || !navmapImage) {
      alert("Please provide a name and select an image for the Nav Map.");
      return;
    }

    const navmapSize = 300;
    const { width, height } = await calculateImageDimensions(navmapImage);
    const maxDimension = Math.max(width, height);
    const newNavMap: NavMap = {
      src: { tag: "Runtime", id: newID(), path: navmapImage },
      id: navmapName,
      rotation: 0,
      defaultZoom: (navmapSize / maxDimension) * 100,
      defaultCenter: { x: width / 2, y: height / 2 },
      size: navmapSize,
    };
    onCreateNavMap(newNavMap); // Pass the new NavMap object directly
    onClose(); // Close the AddNavMap window after creating the Nav Map
  }

  return (
    <Stack
      sx={{
        position: "fixed",
        zIndex: 1050,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        borderRadius: "8px",
        padding: "10px",
        overflow: "hidden",
        width: "300px",
        height: "200px",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Add New Nav Map
      </Typography>
      <TextField
        required
        label="Map Name"
        value={navmapName}
        onChange={handleNameChange}
      />
      <MuiFileInput
        required
        placeholder="Upload Image *"
        value={navmapImgFile}
        onChange={handleImageChange}
        inputProps={{ accept: "image/*" }}
        InputProps={{
          startAdornment: <AttachFileIcon />,
        }}
      />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          onClick={() => {
            void handleCreateNavMap();
          }}
          sx={{ width: "49%" }}
        >
          Create
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ width: "49%" }}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

export default AddNavMap;
