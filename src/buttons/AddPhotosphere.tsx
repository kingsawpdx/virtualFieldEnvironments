import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { Photosphere, VFE, newID } from "../DataStructures";

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

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!map) {
      alert("No map available.");
      return;
    }

    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSelectedCenter({ x, y });
  }

  function handlePhotosphereAdd() {
    if (!photosphereID || !panoImage) {
      alert("Please, provide a name and source file.");
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
        height: "340px",
        width: "370px",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Add New Photosphere
      </Typography>
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
      <Button
        variant="outlined"
        onClick={() => {
          setMapDialogOpen(true);
        }}
      >
        Select Photosphere Location
      </Button>
      {photosphereCenter && (
        <Typography>
          Selected Center: X: {photosphereCenter.x}, Y: {photosphereCenter.y}
        </Typography>
      )}
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{ width: "49%" }}
          onClick={handlePhotosphereAdd}
        >
          Create
        </Button>
        <Button variant="outlined" sx={{ width: "49%" }} onClick={onCancel}>
          Cancel
        </Button>
      </Stack>

      <Dialog
        open={mapDialogOpen}
        onClose={() => {
          setMapDialogOpen(false);
        }}
      >
        <DialogTitle>Select Photosphere Location</DialogTitle>
        <DialogContent>
          {map ? (
            <Box
              onClick={handleMapClick}
              sx={{
                background: `url(${map.src.path}) no-repeat center/contain`,
                width: map.width,
                height: map.height,
                border: "1px solid black",
                cursor: "crosshair",
                position: "relative",
              }}
            >
              {selectedCenter && (
                <div
                  style={{
                    position: "absolute",
                    top: `${selectedCenter.y}px`,
                    left: `${selectedCenter.x}px`,
                    backgroundColor: "yellow",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </Box>
          ) : (
            <div style={{ color: "red" }}>No map available</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (selectedCenter) {
                setPhotosphereCenter(selectedCenter);
                setMapDialogOpen(false);
              } else {
                alert("Please select a center.");
              }
            }}
          >
            Select
          </Button>
          <Button
            onClick={() => {
              setMapDialogOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default AddPhotosphere;
