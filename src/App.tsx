import localforage from "localforage";
import { Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import { load } from "./FileOperations.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import Prototype from "./Prototype.tsx";
import { convertRuntimeToStored, convertVFE } from "./VFEConversion.ts";
import VFELoader from "./VFELoader.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  const navigate = useNavigate();

  //Create a function to set useState true
  function handleLoadTestVFE() {
    navigate("/prototype");
  }

  function handleCreateVFE() {
    navigate("/create");
  }

  async function loadCreatedVFE(networkVFE: VFE) {
    const localVFE = await convertVFE(
      networkVFE,
      convertRuntimeToStored(networkVFE.name),
    );
    await localforage.setItem(localVFE.name, localVFE);
    navigate(`/editor/${localVFE.name}/${localVFE.defaultPhotosphereID}`);
  }

  async function handleLoadVFE(file: File, openInViewer: boolean) {
    const localVFE = await load(file);
    if (localVFE) {
      await localforage.setItem(localVFE.name, localVFE);
      const target = openInViewer ? "viewer" : "editor";
      navigate(`/${target}/${localVFE.name}/${localVFE.defaultPhotosphereID}`);
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
            onLoadVFE={(file, openInViewer) => {
              void handleLoadVFE(file, openInViewer);
            }}
          />
        }
      />
      <Route path="/prototype" element={<Prototype />} />
      <Route
        path="/create"
        element={
          <CreateVFEForm
            onCreateVFE={(data) => {
              void loadCreatedVFE(data);
            }}
            header={{
              onLoadTestVFE: handleLoadTestVFE,
              onCreateVFE: handleCreateVFE,
            }}
            onClose={() => {
              // Define what happens when the user clicks the cancel button
              navigate("/");
            }}
          />
        }
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
