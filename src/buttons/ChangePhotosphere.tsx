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
    <Dialog open={true} onClose={onCancel}>
      <DialogTitle>Change Photosphere</DialogTitle>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack gap={2}>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePhotosphere;
