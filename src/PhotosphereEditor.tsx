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
          zIndex: 1000, //So this has to be high so it sits ontop of the viewer
          left: "20px",
          top: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Actual buttons */}
        <button style={{ margin: "20px 0" }}>Add New Photosphere</button>
        <button style={{ margin: "20px 0" }}>Add New NavMap</button>
        <button style={{ margin: "20px 0" }}>Add New Hotspot</button>
      </div>
      {/* PhotosphereViewer takes the full screen */}
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer vfe={vfe} />
      </div>
    </div>
  );
};

export default PhotosphereEditor;
