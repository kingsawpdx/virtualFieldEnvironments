import { useState } from "react";

import AddHotspot from "./AddHotspot.tsx";
import AddNavmap from "./AddNavmap";
import AddPhotosphere from "./AddPhotosphere.tsx";
import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

/* -----------------------------------------------------------------------
    Update the Virtual Field Environment with an added Photosphere.

    * Take the initial VFE from parent
    * If a change has been made to the parentVFE -> updateTrigger === true
    * Send the newPhotosphere back to parent
    * Parent updates the VFE with the newPhotosphere object
   ----------------------------------------------------------------------- */

function radToDeg(num: number): number {
  return num * (180 / Math.PI);
}

// Properties passed down from parent
interface PhotosphereEditorProps {
  currentPS: string;
  onChangePS: (id: string) => void;
  parentVFE: VFE;
  onUpdateVFE: (updatedVFE: VFE, currentPS?: string) => void;
}

// If an update is triggered, add newPhotosphere, and update VFE
function PhotosphereEditor({
  currentPS,
  onChangePS,
  parentVFE,
  onUpdateVFE,
}: PhotosphereEditorProps): JSX.Element {
  // Base states
  const [vfe, setVFE] = useState<VFE>(parentVFE);
  const [showAddPhotosphere, setShowAddPhotosphere] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showAddNavMap, setShowAddNavMap] = useState(false); // State to manage whether to show AddNavmap

  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);

  console.log(vfe);

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

  function handleCreateNavMap(updatedNavMap: NavMap) {
    const updatedVFE: VFE = {
      ...vfe,
      map: updatedNavMap,
    };
    setVFE(updatedVFE); // Update the local VFE state
    onUpdateVFE(updatedVFE); // Propagate the change to the parent component
    setShowAddNavMap(false); // Close the AddNavMap component
  }

  function handleAddHotspot(newHotspot: Hotspot3D) {
    const photosphere: Photosphere = vfe.photospheres[currentPS];

    photosphere.hotspots[newHotspot.tooltip] = newHotspot;

    setVFE(vfe);
    onUpdateVFE(vfe, currentPS);
    setShowAddHotspot(false);
    setUpdateTrigger((prev) => prev + 1);
  }

  function handleLocation(vpitch: number, vyaw: number) {
    setPitch(radToDeg(vpitch));
    setYaw(radToDeg(vyaw));
  }

  // Reset all states so we dont have issues with handling different components at the same time
  function resetStates() {
    setShowAddPhotosphere(false);
    setShowAddNavMap(false);
    setShowAddHotspot(false);
    setPitch(0);
    setYaw(0);
  }

  // This function is where we render the actual component based on the useState
  function ActiveComponent() {
    if (showAddPhotosphere)
      return <AddPhotosphere onAddPhotosphere={handleAddPhotosphere} />;
    if (showAddNavMap)
      return (
        <AddNavmap onCreateNavMap={handleCreateNavMap} onClose={resetStates} />
      );
    // Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
    //Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
    if (showAddHotspot)
      return (
        <AddHotspot
          onCancel={resetStates}
          onAddHotspot={handleAddHotspot}
          pitch={pitch}
          yaw={yaw}
        />
      );
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
            setShowAddHotspot(true);
          }}
        >
          Add New Hotspot
        </button>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer
          currentPS={currentPS}
          onChangePS={onChangePS}
          onViewerClick={handleLocation}
          key={updateTrigger}
          vfe={vfe}
        />
        <ActiveComponent />
      </div>
    </div>
  );
}

export default PhotosphereEditor;
