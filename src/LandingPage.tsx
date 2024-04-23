import { Box } from "@mui/material";

import Header from "./Header";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
}

function LandingPage({ onLoadTestVFE, onCreateVFE }: LandingPageProps) {
  return (
    <Box sx={{ display: "flex" }}>
      <Header onCreateVFE={onCreateVFE} onLoadTestVFE={onLoadTestVFE} />
    </Box>
  );
}

export default LandingPage;
