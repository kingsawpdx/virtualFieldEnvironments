import JSZip from "jszip";
import localforage from "localforage";
import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import PhotosphereLoader from "./PhotosphereLoader.tsx";
import Prototype from "./Prototype.tsx";
import { convertLocalToNetwork, convertVFE } from "./VFEConversion.ts";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [vfeData, setVFEData] = useState<VFE | null>(null);

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
    navigate(`/editor/${data.name}/${data.defaultPhotosphereID}`);
  }

  function handleUpdateVFE(updatedVFE: VFE) {
    setVFEData(updatedVFE);
  }

  async function handleLoadVFE(file: File) {
    const zip: JSZip = await JSZip.loadAsync(file);
    const data = await zip.file("data.json")?.async("string");
    if (data) {
      await localforage.setItem("loaded", JSON.parse(data) as VFE);
      const vfe: VFE | null = await localforage.getItem("loaded");
      if (vfe) {
        const convertedVFE = await convertVFE(vfe, convertLocalToNetwork);
        loadCreatedVFE(convertedVFE);
      }
    }
  }

  return (
    <Routes>
      <Route
        index
        element={
          <LandingPage
            onLoadTestVFE={handleLoadTestVFE}
            onCreateVFE={handleCreateVFE}
            onLoadVFE={(file) => {
              void handleLoadVFE(file);
            }}
          />
        }
      />
      <Route
        path="/viewer"
        // TODO: replace with a way to select a VFE from a list
        element={<Prototype />}
      />
      <Route path="/viewer/:vfeID" element={<PhotosphereLoader />}>
        <Route path=":photosphereID" element={null} />
      </Route>
      <Route
        path="/create"
        element={<CreateVFEForm onCreateVFE={loadCreatedVFE} />}
      />
      <Route
        path="/editor"
        // TODO: replace with a way to select a VFE from a list
        element={<Navigate to="/create" replace={true} />}
      />
      <Route
        path="/editor/:vfeID"
        element={
          vfeData ? (
            <PhotosphereEditor
              parentVFE={vfeData}
              onUpdateVFE={handleUpdateVFE}
            />
          ) : (
            // redirect back to the create form if VFE hasn't been created yet
            <Navigate to="/create" replace={true} />
          )
        }
      >
        <Route path=":photosphereID" element={null} />
      </Route>
    </Routes>
  );
}

export default AppRoot;
