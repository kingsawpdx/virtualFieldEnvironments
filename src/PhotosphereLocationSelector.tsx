import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

import { NavMap } from "./DataStructures.ts";

interface PhotosphereLocationSelectorProps {
  navMap: NavMap;
  initialPosition?: { x: number; y: number } | null;
  onSelect: (position: { x: number; y: number }) => void;
  onCancel: () => void;
}

function PhotosphereLocationSelector({
  navMap,
  initialPosition = null,
  onSelect,
  onCancel,
}: PhotosphereLocationSelectorProps) {
  const [photospherePosition, setPhotospherePosition] = useState<{
    x: number;
    y: number;
  } | null>(initialPosition);
  const [open, setOpen] = useState(true);

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPhotospherePosition({ x, y });
  }

  function handleClose() {
    setOpen(false);
    onCancel();
  }

  function handleSelect() {
    if (photospherePosition) {
      onSelect({
        x:
          navMap.width > 550
            ? (photospherePosition.x * navMap.width) / 550
            : photospherePosition.x,
        y:
          navMap.width > 550
            ? (photospherePosition.y * navMap.width) / 550
            : photospherePosition.y,
      });
      setOpen(false);
    } else {
      alert("Please select a center.");
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Photosphere Location</DialogTitle>
      <DialogContent>
        <Box
          onClick={handleMapClick}
          sx={{
            background: `url(${navMap.src.path}) no-repeat center/contain`,
            width: navMap.width,
            height: navMap.height,
            border: "1px solid black",
            cursor: "crosshair",
            position: "relative",
            maxWidth: "550px",
            maxHeight: `${(1 / (navMap.width / 550)) * navMap.height}px`,
          }}
        >
          {photospherePosition && (
            <div
              style={{
                position: "absolute",
                top: `${photospherePosition.y}px`,
                left: `${photospherePosition.x}px`,
                backgroundColor: "yellow",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSelect}>Select</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PhotosphereLocationSelector;
