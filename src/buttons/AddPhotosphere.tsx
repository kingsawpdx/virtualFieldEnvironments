import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";

import { Photosphere } from "../DataStructures";

/* -----------------------------------------------------------------------
    Add a photosphere to a Virtual Field Environment (VFE) using React.

    * Props object allows us to send the new Photosphere back to parent
    * Pass props object to AddPhotosphere function
    * Input data
    * Check for errors
    * Create newPhotosphere object
    * Pass it back to parent to update the VFE with the newPhotosphere
   ----------------------------------------------------------------------- */

export interface PhotosphereCenterFormProps {
  setPhotosphereCenter: (center: { x: number; y: number } | null) => void;
}

// Form inputs for setting the photosphere position on the map.
export function PhotosphereCenterFieldset({
  setPhotosphereCenter,
}: PhotosphereCenterFormProps) {
  const [photosphereCenterX, setPhotosphereCenterX] = useState("");
  const [photosphereCenterY, setPhotosphereCenterY] = useState("");

  useEffect(() => {
    const center = {
      x: parseFloat(photosphereCenterX),
      y: parseFloat(photosphereCenterY),
    };

    if (!isNaN(center.x) && !isNaN(center.y)) {
      setPhotosphereCenter(center);
    } else {
      setPhotosphereCenter(null);
    }
  }, [photosphereCenterX, photosphereCenterY, setPhotosphereCenter]);

  return (
    <fieldset>
      <legend>Photosphere Map Position (Optional):</legend>
      <div>
        <label htmlFor="photosphereCenterX">X Coordinate:</label>
        <input
          type="number"
          id="photosphereCenterX"
          value={photosphereCenterX}
          onChange={(e) => {
            setPhotosphereCenterX(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="photosphereCenterY">Y Coordinate:</label>
        <input
          type="number"
          id="photosphereCenterY"
          value={photosphereCenterY}
          onChange={(e) => {
            setPhotosphereCenterY(e.target.value);
          }}
        />
      </div>
    </fieldset>
  );
}

// Properties passed down from parent
interface AddPhotosphereProps {
  onAddPhotosphere: (newPhotosphere: Photosphere) => void;
}

// Create new photosphere
function AddPhotosphere({
  onAddPhotosphere,
}: AddPhotosphereProps): JSX.Element {
  // Base states
  const [photosphereID, setPhotosphereID] = useState("");
  const [panoImage, setPanoImage] = useState("");
  const [panoFile, setPanoFile] = useState<File | null>(null); // for MuiFileInput
  const [audioFileStr, setAudioFileStr] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null); // for MuiFileInput
  const [photosphereCenter, setPhotosphereCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Add image data
  function handleImageChange(file: File | null) {
    if (file) {
      setPanoFile(file);
      setPanoImage(URL.createObjectURL(file));
    }
  }

  // Add audio data
  function handleAudioChange(file: File | null) {
    if (file) {
      setAudioFile(file);
      setAudioFileStr(URL.createObjectURL(file));
    }
  }

  // Error handling: check to see if required data != null
  function handlePhotosphereAdd() {
    if (!photosphereID || !panoImage) {
      alert("Please, provide a name and source file.");
      return;
    }

    // Create new photosphere object
    const newPhotosphere: Photosphere = {
      id: photosphereID,
      src: { tag: "Network", path: panoImage },
      center: photosphereCenter ?? undefined,
      hotspots: {},
      backgroundAudio: audioFileStr
        ? { tag: "Network", path: audioFileStr }
        : undefined,
    };

    // Pass newPhotosphere back to parent to update VFE
    onAddPhotosphere(newPhotosphere);

    // Reset the form fields after adding the photosphere
    setPhotosphereID("");
    setPanoImage("");
    setAudioFileStr("");
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
      <PhotosphereCenterFieldset setPhotosphereCenter={setPhotosphereCenter} />
      <Button onClick={handlePhotosphereAdd}>Add Photosphere</Button>
    </Stack>
  );
}

export default AddPhotosphere;
