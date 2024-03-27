import { useState } from "react";

import LandingPage from "./LandingPage.tsx";
import App from "./Prototype.tsx";
import CreateVFEForm from "./CreateVFE.tsx";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import { VFE } from "./DataStructures.ts";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
const AppRoot = () => {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [showApp, setShowApp] = useState(false);
  const [showCreateVFEForm, setShowCreateVFEForm] = useState(false);
  const [vfeData, setVFEData] = useState<VFE | null>(null)

  //Create a function to set useState true
  const handleLoadTestVFE = () => {
    setShowApp(true);
  };

  const handleCreateVFE = () => {
    setShowCreateVFEForm(true)
  }

  const loadCreatedVFE = (data:VFE) => {
    setVFEData(data)
    setShowApp(true)
  }

  return (
    <div>
    {!showApp && !showCreateVFEForm ? (
      <LandingPage
        onLoadTestVFE={handleLoadTestVFE}
        onCreateVFE={handleCreateVFE}
      />
    ) : showCreateVFEForm ? (
      <CreateVFEForm onCreateVFE={loadCreatedVFE}  />
    ) : (
      <>
      <App />
      {vfeData && <PhotosphereViewer vfe={vfeData} />}
      </>
    )}
  </div>
  );
};

export default AppRoot;
