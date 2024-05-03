import JSZip from "jszip";
import localforage from "localforage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import Prototype from "./Prototype.tsx";
import { convertLocalToNetwork, convertVFE } from "./VFEConversion.ts";
import VFELoader from "./VFELoader.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  const navigate = useNavigate();

  //Create a function to set useState true
  function handleLoadTestVFE() {
    navigate("/viewer");
  }

  function handleCreateVFE() {
    navigate("/create");
  }

  async function loadCreatedVFE(vfe: VFE) {
    await localforage.setItem(vfe.name, vfe);
    navigate(`/editor/${vfe.name}/${vfe.defaultPhotosphereID}`);
  }

  async function handleLoadVFE(file: File) {
    const zip: JSZip = await JSZip.loadAsync(file);
    const data = await zip.file("data.json")?.async("string");
    if (data) {
      const vfe = JSON.parse(data) as VFE;
      const convertedVFE = await convertVFE(vfe, convertLocalToNetwork);
      await loadCreatedVFE(convertedVFE);
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
      <Route
        path="/viewer/:vfeID"
        element={
          <VFELoader render={(props) => <PhotosphereViewer {...props} />} />
        }
      >
        <Route path=":photosphereID" element={null} />
      </Route>
      <Route
        path="/create"
        element={
          <CreateVFEForm
            onCreateVFE={(data) => {
              void loadCreatedVFE(data);
            }}
          />
        }
      />
      <Route
        path="/editor"
        // TODO: replace with a way to select a VFE from a list
        element={<Navigate to="/create" replace={true} />}
      />
      <Route
        path="/editor/:vfeID"
        element={
          <VFELoader render={(props) => <PhotosphereEditor {...props} />} />
        }
      >
        <Route path=":photosphereID" element={null} />
      </Route>
    </Routes>
  );
}

export default AppRoot;
