import { useState } from "react";
import AddNavmap from "./AddNavmap"; // Import the AddNavmap component
import AddPhotosphere from "./AddPhotosphere.tsx";
import { VFE, NavMap } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

interface PhotosphereEditorProps {
  vfe: VFE;
}

function PhotosphereEditor({ vfe }: PhotosphereEditorProps): JSX.Element {
  //Basic states for each component, its basically just a boolean
  const [showAddPhotosphere, setShowAddPhotosphere] = useState(false);
  const [showAddNavMap, setShowAddNavMap] = useState(false); // State to manage whether to show AddNavmap
  //Create a useState for your component
  const [navMap, setNavMap] = useState<NavMap | null>(null); // State to store the new navigation map


  //Reset all states so we dont have issues with handling different components at the same time
  function resetStates() {
    setShowAddPhotosphere(false);
    setShowAddNavMap(false);
    //Dont forget to reset your usestate!
  }

  //This function is where we render the actual component based on the useState
  function ActiveComponent() {
    if (showAddPhotosphere) return <AddPhotosphere />;
    if (showAddNavMap) return <AddNavmap onCreateNavMap={handleCreateNavMap} onClose={resetStates} />;
    return null;
    //Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
  }

  function handleCreateNavMap(navMap: NavMap) {
  setNavMap(navMap);
    setShowAddNavMap(false);
}
<AddNavmap onCreateNavMap={handleCreateNavMap} onClose={resetStates} />

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", bottom: "10px", left: "10px", zIndex: 10 }}>
        {/* Render the navigation map */}
        {navMap && (
          <div>
            <img src={navMap.src} alt="Nav Map" style={{ width: "200px", height: "auto" }} />
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          left: "20px",
          top: "20px",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <button
          style={{ margin: "10px 0" }}
          onClick={() => {
            resetStates();
            setShowAddPhotosphere(true);
          }}
        >
          Add New Photosphere
        </button>
        <button
          style={{ margin: "10px 0" }}
          onClick={() => {
            resetStates();
            setShowAddNavMap(true); // Set state to show AddNavmap
            //Call your setShowAddNavmap function to set the state and display the function
          }}
        >
          Add New NavMap
        </button>
        <button
          style={{ margin: "10px 0" }}
          onClick={() => {
            resetStates();
            //Call your setShowAddHotspot function to set the state and display the function
          }}
        >
          Add New Hotspot
        </button>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer vfe={vfe} />
        <ActiveComponent />
      </div>
    </div>
  );
}

export default PhotosphereEditor;
