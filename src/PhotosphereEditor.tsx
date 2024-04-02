import PropTypes from "prop-types";

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
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {/* Actual buttons */}
        <button style={{ margin: "10px 0" }}>Add New Photosphere</button>
        <button style={{ margin: "10px 0" }}>Add New NavMap</button>
        <button style={{ margin: "10px 0" }}>Add New Hotspot</button>
      </div>
      {/* PhotosphereViewer takes the full screen */}
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer vfe={vfe} />
      </div>
    </div>
  );
};

PhotosphereEditor.propTypes = {
  vfe: PropTypes.any,
};

export default PhotosphereEditor;
