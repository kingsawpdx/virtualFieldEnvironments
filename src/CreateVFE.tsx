import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { PhotosphereCenterFieldset } from "./AddPhotosphere.tsx";
import { VFE } from "./DataStructures.ts";

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
  const [panoFile, setPanoFile] = useState<File | null>(null); // needed for MuiFileInput
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
        },
      },
    };
    onCreateVFE(data);
  }

  function handleImageChange(file: File | null) {
    if (file) {
      setPanoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result as string;
        setPanoImage(imageURL);
      };
      reader.readAsDataURL(file);
    }
    return;
  }
  // Add styling to input interface
  return (
    <Stack sx={{ width: 450, margin: "auto", paddingTop: 20 }} spacing={3}>
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
      </Stack>
      <MuiFileInput
        required
        placeholder="Upload a Panorama *"
        value={panoFile}
        onChange={handleImageChange}
        inputProps={{ accept: "image/*" }}
        InputProps={{
          startAdornment: <AttachFileIcon />,
        }}
      />
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
