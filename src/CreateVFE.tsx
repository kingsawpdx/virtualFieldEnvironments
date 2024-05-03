import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { VFE } from "./DataStructures.ts";
import { PhotosphereCenterFieldset } from "./buttons/AddPhotosphere.tsx";

/* -----------------------------------------------------------------------
    Create a Virtual Field Environment (VFE) that will contain many
    Photospheres.

    * Props object allows us to send the new Photosphere back to parent
    * Pass props object to AddPhotosphere function
    * Input data
    * Check for errors
    * Create newPhotosphere object
    * Pass it back to parent to update the VFE with the newPhotosphere
   ----------------------------------------------------------------------- */

// Properties passed down from parent
interface CreateVFEFormProps {
  onCreateVFE: (data: VFE) => void;
}

// Add a new VFE
function CreateVFEForm({ onCreateVFE }: CreateVFEFormProps) {
  // Base states
  const [vfeName, setVFEName] = useState("");
  const [photosphereName, setPhotosphereName] = useState(""); // State for Photosphere Name
  const [panoImage, setPanoImage] = useState("");
  const [audio, setAudio] = useState("");
  const [photosphereCenter, setPhotosphereCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Error Handling: Ensure the data is not empty
  function handleCreateVFE() {
    if (vfeName.trim() === "" || photosphereName.trim() === "" || !panoImage) {
      alert("Please, provide a VFE name, Photosphere name, and an image.");
      return;
    }
    // Input data into new VFE
    const data: VFE = {
      name: vfeName,
      defaultPhotosphereID: photosphereName,
      photospheres: {
        [photosphereName]: {
          id: photosphereName,
          src: panoImage,
          center: photosphereCenter ?? undefined,
          hotspots: {},
          backgroundAudio: audio,
        },
      },
    };
    onCreateVFE(data);
  }

  function handleImageChange(file: File | null) {
    if (file) {
      setPanoImage(URL.createObjectURL(file));
    }
  }

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(URL.createObjectURL(file));
    }
    return;
  }

  // Add styling to input interface
  return (
    <Stack sx={{ width: 450, margin: "auto", paddingTop: 20 }} spacing={3}>
      <Header />
      <Typography variant="h4">Create a New VFE</Typography>
      <Stack direction="row" spacing={"auto"}>
        <TextField
          required
          label="VFE Name"
          onChange={(e) => {
            setVFEName(e.target.value);
          }}
        />
        <TextField
          required
          label="Photosphere Name"
          onChange={(e) => {
            setPhotosphereName(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="panoImage">Panorama Image:</label>
        <input
          type="file"
          id="panoImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <label htmlFor="audio">Add Audio (Optional):</label>
        <input type="file" id="audio" onChange={handleAudioChange} />
      </div>
      <PhotosphereCenterFieldset setPhotosphereCenter={setPhotosphereCenter} />
      <Button
        sx={{ margin: "auto" }}
        variant="contained"
        onClick={handleCreateVFE}
      >
        Create
      </Button>
    </Stack>
  );
}

export default CreateVFEForm;
