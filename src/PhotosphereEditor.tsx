import { useState } from "react";

import AddPhotosphere from "./AddPhotosphere.tsx";
import { Photosphere, VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

/* -----------------------------------------------------------------------
    Update the Virtual Field Environment with an added Photosphere.

    * Take the initial VFE from parent
    * If a change has been made to the parentVFE -> updateTrigger === true
    * Send the newPhotosphere back to parent 
    * Parent updates the VFE with the newPhotosphere object
   ----------------------------------------------------------------------- */

// Properties passed down from parent
interface PhotosphereEditorProps {
  parentVFE: VFE;
  onUpdateVFE: (updatedVFE: VFE) => void;
}

// If an update is triggered, add newPhotosphere, and update VFE
function PhotosphereEditor({
  parentVFE,
  onUpdateVFE,
}: PhotosphereEditorProps): JSX.Element {
  // Base states
  const [vfe, setVFE] = useState<VFE>(parentVFE);
  const [showAddPhotosphere, setShowAddPhotosphere] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Update the VFE
  function handleAddPhotosphere(newPhotosphere: Photosphere) {
    const updatedVFE: VFE = {
      ...vfe,
      photospheres: {
        ...vfe.photospheres,
        [newPhotosphere.id]: newPhotosphere,
      },
    };
    setVFE(updatedVFE); // Update the local VFE state
    onUpdateVFE(updatedVFE); // Propagate the change to the AppRoot
    setShowAddPhotosphere(false);
    setUpdateTrigger((prev) => prev + 1);
  }

  // Reset all states so we dont have issues with handling different components at the same time
  function resetStates() {
    setShowAddPhotosphere(false);
  }

  // This function is where we render the actual component based on the useState
  function ActiveComponent() {
    if (showAddPhotosphere)
      return <AddPhotosphere onAddPhotosphere={handleAddPhotosphere} />;
    // Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
    return null;
  }
  // Add styling for inputting information
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
          }}
        >
          Add New Hotspot
        </button>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer key={updateTrigger} vfe={vfe} />
        <ActiveComponent />
      </div>
    </div>
  );
}

export default PhotosphereEditor;
