import { useState } from "react";

import AddHotspot from "./AddHotspot.tsx";
import AddPhotosphere from "./AddPhotosphere.tsx";
import { VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

interface PhotosphereEditorProps {
  vfe: VFE;
}

function PhotosphereEditor({ vfe }: PhotosphereEditorProps): JSX.Element {
  //Basic states for each component, its basically just a boolean
  const [showAddPhotosphere, setShowAddPhotosphere] = useState(false);
  //Create a useState for your component
  const [showAddHotspot, setShowAddHotspot] = useState(false);

  //Reset all states so we dont have issues with handling different components at the same time
  function resetStates() {
    setShowAddPhotosphere(false);
    //Dont forget to reset your usestate!
    setShowAddHotspot(false);
  }

  //This function is where we render the actual component based on the useState
  function ActiveComponent() {
    if (showAddPhotosphere) return <AddPhotosphere />;
    //Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
    if (showAddHotspot) return <AddHotspot vfe={vfe} />;
    return null;
  }

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
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
            setShowAddHotspot(true);
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
