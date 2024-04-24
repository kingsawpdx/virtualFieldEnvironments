import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";

import { NavMap } from "./DataStructures";

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
      const reader = new FileReader();
      reader.onloadend = function () {
        setNavmapImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleCreateNavMap() {
    if (navmapName.trim() === "" || !navmapImage) {
      alert("Please provide a name and select an image for the Nav Map.");
      return;
    }

    const navmapSize = 200;
    const { width, height } = await calculateImageDimensions(navmapImage);
    const maxDimension = Math.max(width, height);
    const newNavMap: NavMap = {
      src: navmapImage,
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
    <Box
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
      }}
    >
      <Typography variant="h3">Add New Nav Map</Typography>
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
      <Stack direction="row">
        <Button
          onClick={() => {
            void handleCreateNavMap();
          }}
        >
          Create
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </Box>
  );
}

export default AddNavMap;
