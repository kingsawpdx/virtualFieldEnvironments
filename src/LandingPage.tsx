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
    </div>
  );
}

export default LandingPage;
