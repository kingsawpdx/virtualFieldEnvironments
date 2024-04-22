import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { VFE } from "./DataStructures.ts";

//import PhotosphereViewer from "./PhotosphereViewer.tsx";

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

  // Error Handling: Ensure the data is not empty
  function handleCreateVFE() {
    if (vfeName.trim() === "" || photosphereName.trim() === "" || !panoImage) {
      alert("Please, provide a VFE name, Photosphere name, and an image.");
      return;
    }
    // Input data into new VFE
    const data: VFE = {
      name: vfeName,
      map: {
        src: "",
        rotation: 0,
        defaultZoom: 0,
        hotspots: [],
      },
      defaultPhotosphereID: photosphereName,
      photospheres: {
        [photosphereName]: {
          id: photosphereName,
          src: panoImage,
          center: { x: 0, y: 0 },
          hotspots: {},
        },
      },
    };
    onCreateVFE(data);
    //return <PhotosphereViewer vfe={data} />;
  }

  // Ensure file is truthy
  // function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const imageURL = reader.result as string;
  //       setPanoImage(imageURL);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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
    <Box>
      <h2>Create a New Virtual Field Environment</h2>
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
      <MuiFileInput
        required
        placeholder="Upload a Panorama"
        value={panoFile}
        onChange={handleImageChange}
        inputProps={{ accept: "image/*" }}
        InputProps={{
          startAdornment: <AttachFileIcon />,
        }}
      />
      <Button onClick={handleCreateVFE}>Create VFE</Button>
    </Box>
    // <div>
    //   <h2>Create a New Virtual Field Environment (VFE)</h2>
    //   <div>
    //     <label htmlFor="vfeName">VFE Name:</label>
    //     <input
    //       type="string"
    //       id="vfeName"
    //       value={vfeName}
    //       onChange={(e) => {
    //         setVFEName(e.target.value);
    //       }}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="photosphereName">Photosphere Name:</label>
    //     <input
    //       type="string"
    //       id="photosphereName"
    //       value={photosphereName}
    //       onChange={(e) => {
    //         setPhotosphereName(e.target.value);
    //       }}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="panoImage">Panorama Image:</label>
    //     <input
    //       type="file"
    //       id="panoImage"
    //       accept="image/*"
    //       onChange={handleImageChange}
    //     />
    //   </div>
    //   <button onClick={handleCreateVFE}>Create VFE</button>
    // </div>
  );
}

export default CreateVFEForm;
