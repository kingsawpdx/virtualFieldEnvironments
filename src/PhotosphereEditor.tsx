import { VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

interface PhotosphereEditorProps {
  vfe: VFE;
}

const PhotosphereEditor: React.FC<PhotosphereEditorProps> = ({ vfe }) => {
  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Overlay container */}
      <div
        style={{
          position: "absolute",
          zIndex: 1000, // Ensure the overlay content appears above the viewer
          left: "20px", // Adjust as needed for desired overlay position
          top: "20px", // Adjust as needed for desired overlay position
          display: "flex",
          flexDirection: "column", // Stack buttons vertically
        }}
      >
        {/* Actual buttons */}
        <button style={{ margin: "20px 0" }}>Add New Photosphere</button>
        <button style={{ margin: "20px 0" }}>Add New NavMap</button>
        <button style={{ margin: "20px 0" }}>Add New Hotspot</button>
      </div>
      {/* PhotosphereViewer taking the full screen */}
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer vfe={vfe} />
      </div>
    </div>
  );
};

export default PhotosphereEditor;
