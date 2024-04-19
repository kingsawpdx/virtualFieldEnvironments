import { Button, Stack } from "@mui/material";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
}

function LandingPage({ onLoadTestVFE, onCreateVFE }: LandingPageProps) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
      }}
    >
      <h1> Welcome to the Virtual Field Enviornment (VFE) </h1>
      <p> Explore and create virtual field enviornments! </p>
      <Stack direction={"column"} alignItems={"center"}>
        <Button
          variant="contained"
          onClick={onLoadTestVFE}
          style={{
            padding: "10px 20px",
            margin: "20px",
          }}
        >
          Load Test VFE
        </Button>
        <Button
          variant="contained"
          onClick={onCreateVFE}
          style={{
            padding: "10px 20px",
            margin: "20px",
          }}
        >
          Create VFE
        </Button>
      </Stack>
    </div>
  );
}

export default LandingPage;
