import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

import { VFE } from "../DataStructures";
import PhotosphereSelector, {
  PhotosphereSelectorProps,
} from "../PhotosphereSelector";

interface EditNavMapProps {
  onClose: () => void;
  vfe: VFE;
  onUpdateVFE: (updatedVFE: VFE) => void;
}

function EditNavMap({ onClose, vfe, onUpdateVFE }: EditNavMapProps) {
  const [selectedPhotosphere, setSelectedPhotosphere] = useState("");

  const options: string[] = Object.keys(vfe.photospheres);

  const selectorProps: PhotosphereSelectorProps = {
    options: options,
    value: selectedPhotosphere,
    setValue: setSelectedPhotosphere,
  };

  const map = vfe.map;

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!selectedPhotosphere || !map) {
      alert("Please select a photosphere and ensure a map is loaded first.");
      return;
    }

    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const updatedPhotospheres = { ...vfe.photospheres };
    const photosphere = updatedPhotospheres[selectedPhotosphere];
    photosphere.center = { x: x * 2, y: y * 2 };

    const updatedVFE: VFE = {
      ...vfe,
      photospheres: updatedPhotospheres,
    };

    onUpdateVFE(updatedVFE);
    // Clear the selection after placing the hotspot
    setSelectedPhotosphere("");
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
        padding: "20px",
        maxWidth: "80%",
        maxHeight: "80%",
        overflowY: "auto",
      }}
    >
      <h2>Edit NavMap</h2>
      <Stack spacing={2}>
        <PhotosphereSelector {...selectorProps} />
        {map ? (
          <div
            onClick={handleMapClick}
            style={{
              background: `url(${map.src.path}) no-repeat center/contain`,
              width: map.defaultCenter.x,
              height: map.defaultCenter.y,
              border: "1px solid black",
              cursor: "crosshair",
              position: "relative",
            }}
          >
            {Object.values(vfe.photospheres).map((photosphere, index) => {
              if (photosphere.center) {
                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      top: `${photosphere.center.y / 2}px`,
                      left: `${photosphere.center.x / 2}px`,
                      backgroundColor: "yellow",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)", // Center the marker
                    }}
                    title={photosphere.id}
                  />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div style={{ color: "red" }}>No map available</div>
        )}
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Box>
  );
}

export default EditNavMap;
