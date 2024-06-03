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
import { useState } from "react";

import { Photosphere, VFE, newID } from "../DataStructures";
import PhotosphereLocationSelector from "../PhotosphereLocationSelector.tsx";
import { alertMUI } from "../StyledDialogWrapper.tsx";

interface AddPhotosphereProps {
  onAddPhotosphere: (newPhotosphere: Photosphere) => void;
  onCancel: () => void;
  vfe: VFE;
}

function AddPhotosphere({
  onAddPhotosphere,
  onCancel,
  vfe,
}: AddPhotosphereProps): JSX.Element {
  const [photosphereID, setPhotosphereID] = useState("");
  const [panoImage, setPanoImage] = useState("");
  const [panoFile, setPanoFile] = useState<File | null>(null);
  const [audioFileStr, setAudioFileStr] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photosphereCenter, setPhotosphereCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const map = vfe.map;

  function handleImageChange(file: File | null) {
    if (file) {
      setPanoFile(file);
      setPanoImage(URL.createObjectURL(file));
    }
  }

  function handleAudioChange(file: File | null) {
    if (file) {
      setAudioFile(file);
      setAudioFileStr(URL.createObjectURL(file));
    }
  }

  async function handlePhotosphereAdd() {
    if (!photosphereID || !panoImage) {
      await alertMUI("Please, provide a name and source file.");
      return;
    }

    const newPhotosphere: Photosphere = {
      id: photosphereID,
      src: { tag: "Runtime", id: newID(), path: panoImage },
      center: photosphereCenter ?? undefined,
      hotspots: {},
      backgroundAudio: audioFileStr
        ? { tag: "Runtime", id: newID(), path: audioFileStr }
        : undefined,
    };

    onAddPhotosphere(newPhotosphere);

    setPhotosphereID("");
    setPanoImage("");
    setAudioFileStr("");
    setPhotosphereCenter(null);
  }

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Add New Photosphere</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack gap={2}>
          <TextField
            required
            label="Photosphere Name"
            value={photosphereID}
            onChange={(e) => {
              setPhotosphereID(e.target.value);
            }}
          />
          <MuiFileInput
            required
            placeholder="Upload Panorama *"
            value={panoFile}
            onChange={handleImageChange}
            inputProps={{ accept: "image/*" }}
            InputProps={{
              startAdornment: <AttachFileIcon />,
            }}
          />
          <MuiFileInput
            placeholder="Upload Background Audio"
            value={audioFile}
            onChange={handleAudioChange}
            inputProps={{ accept: "audio/*" }}
            InputProps={{
              startAdornment: <AttachFileIcon />,
            }}
          />
          {map && (
            <Button
              variant="outlined"
              onClick={() => {
                setMapDialogOpen(true);
              }}
            >
              Select Photosphere Location
            </Button>
          )}

          {map && mapDialogOpen && (
            <PhotosphereLocationSelector
              navMap={map}
              initialPosition={selectedCenter}
              onSelect={(position) => {
                setSelectedCenter(position);
                setMapDialogOpen(false);
              }}
              onCancel={() => {
                setMapDialogOpen(false);
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            void handlePhotosphereAdd();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPhotosphere;
