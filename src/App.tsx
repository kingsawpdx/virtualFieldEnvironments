import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import PhotosphereLoader from "./PhotosphereLoader.tsx";
import Prototype from "./Prototype.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [vfeData, setVFEData] = useState<VFE | null>(null);
  const [currentPhotosphereID, setCurrentPhotosphereID] = useState(
    vfeData ? vfeData.defaultPhotosphereID : "invalid",
  );

  const navigate = useNavigate();

  //Create a function to set useState true
  function handleLoadTestVFE() {
    navigate("/viewer");
  }

  function handleCreateVFE() {
    navigate("/create");
  }

  function loadCreatedVFE(data: VFE) {
    setVFEData(data);
    setCurrentPhotosphereID(
      currentPhotosphereID == "invalid"
        ? data.defaultPhotosphereID
        : currentPhotosphereID,
    );
    navigate("/editor");
  }

  function handleUpdateVFE(updatedVFE: VFE, currentPS?: string) {
    setVFEData(updatedVFE);
    setCurrentPhotosphereID(
      currentPS ? currentPS : updatedVFE.defaultPhotosphereID,
    );
  }

  return (
    <Routes>
      <Route
        index
        element={
          <LandingPage
            onLoadTestVFE={handleLoadTestVFE}
            onCreateVFE={handleCreateVFE}
          />
        }
      />
      <Route path="/viewer" element={<Prototype />} />
      <Route path="/viewer/:vfeID" element={<PhotosphereLoader />}>
        <Route path=":sceneID" />
      </Route>
      <Route
        path="/create"
        element={<CreateVFEForm onCreateVFE={loadCreatedVFE} />}
      />
      <Route
        path="/editor"
        element={
          vfeData ? (
            <PhotosphereEditor
              currentPS={currentPhotosphereID}
              onChangePS={setCurrentPhotosphereID}
              parentVFE={vfeData}
              onUpdateVFE={handleUpdateVFE}
            />
          ) : (
            // redirect back to the create form if VFE hasn't been created yet
            <Navigate to="/create" replace={true} />
          )
        }
      />
    </Routes>
  );
}

export default AppRoot;
