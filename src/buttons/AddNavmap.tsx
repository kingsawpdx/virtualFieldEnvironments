import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";

import { NavMap, calculateImageDimensions, newID } from "../DataStructures";
import { alertMUI } from "../StyledDialogWrapper";

interface AddNavMapProps {
  onCreateNavMap: (navMap: NavMap) => void;
  onClose: () => void; // Function to close the AddNavMap window
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
      await alertMUI(
        "Please provide a name and select an image for the Nav Map.",
      );
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
      width: width,
      height: height,
    };
    onCreateNavMap(newNavMap); // Pass the new NavMap object directly
    onClose(); // Close the AddNavMap window after creating the Nav Map
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle> Add New Nav Map</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack gap={2}>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            void handleCreateNavMap();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNavMap;
