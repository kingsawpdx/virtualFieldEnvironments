// import { Box } from "@mui/material";

// import Header from "./Header";

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
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onLoadVFE(e.target.files[0]);
    }
  }

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
      <button
        onClick={onLoadTestVFE}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          margin: "20px",
          borderRadius: "5px",
          border: "none",
          background: "#4facfe",
          color: "white",
          boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        Load Test VFE
      </button>
      <button
        onClick={onCreateVFE}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          margin: "20px",
          borderRadius: "5px",
          border: "none",
          background: "#4facfe",
          color: "white",
          boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        Create VFE
      </button>
      <input
        onChange={handleFileChange}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          margin: "20px",
          borderRadius: "5px",
          border: "none",
          background: "#4facfe",
          color: "white",
          boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
        }}
        type="file"
      />
    </div>
  );
}

export default LandingPage;
