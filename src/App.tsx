import JSZip from "jszip";
import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import CreateVFEForm from "./CreateVFE.tsx";
import { VFE } from "./DataStructures.ts";
import LandingPage from "./LandingPage.tsx";
import PhotosphereEditor from "./PhotosphereEditor.tsx";
import App from "./Prototype.tsx";
import { convertLocalToNetwork, convertVFE } from "./VFEConversion.ts";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
function AppRoot() {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [vfeData, setVFEData] = useState<VFE | null>(null);
  const [currentPhotosphereID, setCurrentPhotosphereID] = useState(
    vfeData ? vfeData.defaultPhotosphereID : "invalid",
  );
  const [loadFile, setLoadFile] = useState<File | null>(null);

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

  async function getURLs(): Promise<Record<string, string>> {
    return new Promise((resolve) => {
      if (loadFile) {
      }
      const file = loadFile;
      let urls: Record<string, string> = {};
      JSZip.loadAsync(file).then((zip) => {
        zip.folder("assets")?.forEach((path, f) => {});
      });
    });
  }

  async function handleLoadVFE(file: File) {
    // setLoadFile(file);
    const zip: JSZip = await JSZip.loadAsync(file);
    const data = await zip.file("data.json")?.async("string");
    if (data) {
      const vfe = JSON.parse(data) as VFE;
      const convertedVFE = await convertVFE(vfe, convertLocalToNetwork);
      loadCreatedVFE(convertedVFE);
    }

    // JSZip.loadAsync(file).then((zip) => {
    //   zip
    //     .file("data.json")
    //     ?.async("string")
    //     .then((data) => {
    //       const vfe = JSON.parse(data) as VFE;
    //       //const dataLinks = getURLs();

    //       loadCreatedVFE(vfe);
    //     });
    // });
  }

  return (
    <Routes>
      <Route
        index
        element={
          <LandingPage
            onLoadTestVFE={handleLoadTestVFE}
            onCreateVFE={handleCreateVFE}
            onLoadVFE={handleLoadVFE}
          />
        }
      />
      <Route path="/viewer" element={<App />} />
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
