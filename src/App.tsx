import { useState } from "react";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
// import PhotosphereViewer from "./PhotosphereViewer.tsx";
import App from "./Prototype.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
const AppRoot = () => {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [showApp, setShowApp] = useState(false);
  const [showCreateVFEForm, setShowCreateVFEForm] = useState(false);
  const [vfeData, setVFEData] = useState<VFE | null>(null);

  //Create a function to set useState true
  const handleLoadTestVFE = () => {
    setShowApp(true);
    setShowCreateVFEForm(false);
  };

  const handleCreateVFE = () => {
    setShowCreateVFEForm(true);
    setShowApp(false);
  };

  const loadCreatedVFE = (data: VFE) => {
    setVFEData(data);
    setShowApp(true);
    setShowCreateVFEForm(false);
  };

  return (
    <div>
      {showCreateVFEForm ? (
        <CreateVFEForm onCreateVFE={loadCreatedVFE} />
      ) : vfeData && showApp ? (
        <PhotosphereEditor vfe={vfeData} />
      ) : !vfeData && showApp ? (
        <App />
      ) : (
        <LandingPage
          onLoadTestVFE={handleLoadTestVFE}
          onCreateVFE={handleCreateVFE}
        />
      )}
    </div>
  );
};

export default AppRoot;
