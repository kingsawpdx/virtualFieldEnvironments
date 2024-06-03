import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { Photosphere, VFE } from "../DataStructures";
import PhotosphereSelector, {
  PhotosphereSelectorProps,
} from "../PhotosphereSelector";
import { alertMUI } from "../StyledDialogWrapper";

interface EditNavMapProps {
  onClose: () => void;
  vfe: VFE;
  onUpdateVFE: (updatedPhotospheres: Record<string, Photosphere>) => void;
}

function EditNavMap({ onClose, vfe, onUpdateVFE }: EditNavMapProps) {
  const [selectedPhotosphere, setSelectedPhotosphere] = useState("");
  const [localPhotospheres, setLocalPhotospheres] = useState<
    Record<string, Photosphere>
  >(vfe.photospheres);

  const options: string[] = Object.keys(vfe.photospheres);

  const selectorProps: PhotosphereSelectorProps = {
    options: options,
    value: selectedPhotosphere,
    setValue: setSelectedPhotosphere,
  };

  const map = vfe.map;

  async function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!selectedPhotosphere || !map) {
      await alertMUI(
        "Please select a photosphere and ensure a map is loaded first.",
      );
      return;
    }

    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const updatedPhotospheres = { ...localPhotospheres };
    const photosphere = updatedPhotospheres[selectedPhotosphere];
    photosphere.center = { x, y }; // multiply both by 2 because the defaultCenter(x,y) is divinded by 2

    setLocalPhotospheres(updatedPhotospheres); // Update local state
    // Do not call onUpdateVFE here
    setSelectedPhotosphere(""); // Optionally clear the selection after placing the hotspot
  }

  function handleSave() {
    onUpdateVFE(localPhotospheres); // Update global state with local changes
    onClose(); // Optionally close the modal on save
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth={false} scroll="body">
      <DialogTitle>Edit NavMap</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack gap={2}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography>
              Click on the map to change the location of the selected
              photosphere:
            </Typography>
            <PhotosphereSelector {...selectorProps} />
          </Stack>
          {map ? (
            <div
              onClick={(e) => {
                void handleMapClick(e);
              }}
              style={{
                background: `url(${map.src.path}) no-repeat center/contain`,
                width: map.width,
                height: map.height,
                border: "1px solid black",
                cursor: "crosshair",
                position: "relative",
              }}
            >
              {Object.values(localPhotospheres).map((photosphere, index) => {
                if (photosphere.center) {
                  return (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        top: `${photosphere.center.y}px`,
                        left: `${photosphere.center.x}px`,
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditNavMap;
