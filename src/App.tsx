import JSZip from "jszip";
import localforage from "localforage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import Prototype from "./Prototype.tsx";
import { convertNetworkToLocal, convertVFE } from "./VFEConversion.ts";
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

  async function loadCreatedVFE(networkVFE: VFE) {
    const localVFE = await convertVFE(networkVFE, convertNetworkToLocal);
    console.log(localVFE);
    await localforage.setItem(localVFE.name, localVFE);

    navigate(`/editor/${localVFE.name}/${localVFE.defaultPhotosphereID}`);
  }

  async function handleLoadVFE(file: File) {
    const zip: JSZip = await JSZip.loadAsync(file);
    const data = await zip.file("data.json")?.async("string");
    if (data) {
      const localVFE = JSON.parse(data) as VFE;
      await localforage.setItem(localVFE.name, localVFE);
      // const convertedVFE = await convertVFE(vfe, convertLocalToNetwork);
      // await loadCreatedVFE(convertedVFE);

      navigate(`/editor/${localVFE.name}/${localVFE.defaultPhotosphereID}`);
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
