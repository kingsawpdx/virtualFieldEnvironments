import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

import Header from "./Header";
import MuiDropzone from "./MuiDropzone";
import VFEList from "./VFEList";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
  onLoadVFE: (file: File, openInViewer: boolean) => void;
}

function LandingPage({
  onLoadTestVFE,
  onCreateVFE,
  onLoadVFE,
}: LandingPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  function handleFileUpload(file: File) {
    setSelectedFile(file);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setSelectedFile(null);
  }

  function handleLoadVFEWithChoice(openInViewer: boolean) {
    if (selectedFile) {
      onLoadVFE(selectedFile, openInViewer);
      handleCloseDialog();
    }
  }

  return (
    <>
      <Header onCreateVFE={onCreateVFE} onLoadTestVFE={onLoadTestVFE} />
      <Stack sx={{ width: "80%", margin: "auto", padding: 2 }}>
        <MuiDropzone
          label="Drag and drop a VFE or click"
          onInput={(files) => {
            handleFileUpload(files[0]);
          }}
          sx={{
            height: "300px",
            width: "80%",
            margin: "auto",
          }}
        />
        <VFEList />
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Open VFE</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to open the VFE in Viewer or Editor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleLoadVFEWithChoice(true);
            }}
          >
            Viewer
          </Button>
          <Button
            onClick={() => {
              handleLoadVFEWithChoice(false);
            }}
          >
            Editor
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LandingPage;
