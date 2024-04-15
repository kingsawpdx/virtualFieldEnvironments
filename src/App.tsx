import { useState } from "react";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import App from "./Prototype.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [showApp, setShowApp] = useState(false);
  const [showCreateVFEForm, setShowCreateVFEForm] = useState(false);
  const [vfeData, setVFEData] = useState<VFE | null>(null);

  //Create a function to set useState true
  function handleLoadTestVFE() {
    setShowApp(true);
    setShowCreateVFEForm(false);
  }

  function handleCreateVFE() {
    setShowCreateVFEForm(true);
    setShowApp(false);
  }

  function loadCreatedVFE(data: VFE) {
    setVFEData(data);
    setShowApp(true);
    setShowCreateVFEForm(false);
  }

  function handleUpdateVFE(updatedVFE: VFE) {
    setVFEData(updatedVFE);
  }

  function renderComponent() {
    if (showCreateVFEForm) {
      return <CreateVFEForm onCreateVFE={loadCreatedVFE} />;
    } else if (vfeData && showApp) {
      return (
        <PhotosphereEditor parentVFE={vfeData} onUpdateVFE={handleUpdateVFE} />
      );
    } else if (!vfeData && showApp) {
      return <App />;
    } else {
      return (
        <LandingPage
          onLoadTestVFE={handleLoadTestVFE}
          onCreateVFE={handleCreateVFE}
        />
      );
    }
  }

  return <div>{renderComponent()}</div>;
}

export default AppRoot;
