import { Stack } from "@mui/material";
import Dropzone from "react-dropzone";

import FileDropzone from "./FileDropzone";
import Header from "./Header";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
  onLoadVFE: (file: File) => void;
}

function LandingPage({
  onLoadTestVFE,
  onCreateVFE,
  onLoadVFE,
}: LandingPageProps) {
  return (
    <>
      <Header onCreateVFE={onCreateVFE} onLoadTestVFE={onLoadTestVFE} />
      <Stack sx={{ width: "80%", margin: "auto", padding: 2 }}>
        <FileDropzone onUploadVFE={onLoadVFE} />
      </Stack>
    </>
  );
}

export default LandingPage;
