import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

import { Photosphere } from "../DataStructures";

interface ChangePhotosphereProps {
  onChangePhotosphere: (name: string, background: string) => void;
  onCancel: () => void;
  ps: Photosphere;
}

function ChangePhotosphere({
  onChangePhotosphere,
  onCancel,
  ps,
}: ChangePhotosphereProps) {
  const [name, setName] = useState(ps.id);
  const [background, setBackground] = useState(ps.src.path);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  // Function to handle background change
  function handleBackgroundChange(file: File | null) {
    if (file) {
      setBackgroundFile(file);
      setBackground(URL.createObjectURL(file));
    }
  }

  function handleSubmit() {
    if (!name || !background) {
      alert("Please provide a valid name and background image");
      return;
    }
    onChangePhotosphere(name, background);
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
        height: "200px",
        width: "300px",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Change Photosphere
      </Typography>
      <TextField
        label="Photosphere Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <MuiFileInput
        placeholder={background ? "Change Background" : "Upload Background"}
        value={backgroundFile}
        onChange={handleBackgroundChange}
        inputProps={{ accept: "image/*" }}
        InputProps={{
          startAdornment: <AttachFileIcon />,
        }}
      />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{ width: "49%" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button variant="outlined" sx={{ width: "49%" }} onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

export default ChangePhotosphere;
