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

  const [showAddFeatures, setShowAddFeatures] = useState(false);
  const [showChangeFeatures, setShowChangeFeatures] = useState(false);

  const [newName, setNewName] = useState(""); // State to hold the new name
  const [newBackground, setNewBackground] = useState("");

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
    onUpdateVFE(updatedVFE, newPhotosphere.id); // Propagate the change to the AppRoot
    setShowAddPhotosphere(false);
    setUpdateTrigger((prev) => prev + 1);
  }

  function handleCreateNavMap(updatedNavMap: NavMap) {
    const updatedVFE: VFE = {
      ...vfe,
      map: updatedNavMap,
    };
    setVFE(updatedVFE); // Update the local VFE state
    onUpdateVFE(updatedVFE, currentPS); // Propagate the change to the parent component
    setShowAddNavMap(false); // Close the AddNavMap component
    setUpdateTrigger((prev) => prev + 1);
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
    // Below this you will have your conditional for your own component, ie AddNavmap/AddHotspot
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

  // Function to handle name change
  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  // Function to handle background change
  function handleBackgroundChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setNewBackground(URL.createObjectURL(file));
    }
  }

  // Function to handle submit button click for name change
  function handleSubmitName() {
    if (newName.trim() !== "") {
      const currentPhotosphere = vfe.photospheres[currentPS];
      //making updated photosphere list minus the currentPS
      const updatedPhotospheres: Record<string, Photosphere> =
        Object.fromEntries(
          Object.entries(vfe.photospheres).filter(([key]) => key !== currentPS),
        );
      //making currentPS entry with newName
      updatedPhotospheres[newName] = { ...currentPhotosphere, id: newName };
      let dID = "";

      if (currentPS == vfe.defaultPhotosphereID) {
        dID = newName;
      } else {
        dID = vfe.defaultPhotosphereID;
      }
      const updatedVFE: VFE = {
        ...vfe,
        defaultPhotosphereID: dID,
        photospheres: updatedPhotospheres,
      };

      currentPS = newName; //set currentPS index to new name to access it correctly moving forward
      setVFE(updatedVFE);
      onUpdateVFE(updatedVFE, currentPS);
      setUpdateTrigger((prev) => prev + 1);
      setNewName("");
    }
  }

  // Function to handle submit button click for background change
  function handleSubmitBackground() {
    if (newBackground.trim() !== "") {
      const currentPhotosphere = vfe.photospheres[currentPS];
      const updatedPhotospheres = { ...vfe.photospheres };

      updatedPhotospheres[currentPS] = {
        ...currentPhotosphere,
        src: newBackground,
      };

      const updatedVFE: VFE = {
        ...vfe,
        photospheres: updatedPhotospheres,
      };

      setVFE(updatedVFE);
      onUpdateVFE(updatedVFE, currentPS);
      setUpdateTrigger((prev) => prev + 1);
    }
    setNewBackground("");
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
        {!showAddFeatures && !showChangeFeatures && (
          <>
            <button
              style={{ margin: "10px 0" }}
              onClick={() => {
                setShowAddFeatures(true);
              }}
            >
              Add Features
            </button>
            <button
              style={{ margin: "10px 0" }}
              onClick={() => {
                setShowChangeFeatures(true);
              }}
            >
              Change Features
            </button>
          </>
        )}
        {showAddFeatures && (
          <>
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
              {vfe.map ? "Change NavMap" : "Add New NavMap"}
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

            <button
              style={{ margin: "10" }}
              onClick={() => {
                setShowAddFeatures(false);
              }}
            >
              Back
            </button>
          </>
        )}

        {showChangeFeatures && (
          <>
            <button
              style={{ margin: "10px 470px 0 0" }}
              onClick={() => {
                setShowChangeFeatures(false);
              }}
            >
              Back
            </button>
            {/* Buttons for changing features */}
            <div style={{ margin: "10px 0" }}>
              <label htmlFor="newName">New Photosphere Name: </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={handleNameChange}
              />
              <button
                style={{ margin: "0px 5px 0 8px" }}
                onClick={handleSubmitName}
              >
                Change Name
              </button>
            </div>
            <div style={{ margin: "10px 0" }}>
              <label htmlFor="newBackground">New Background: </label>
              <input
                type="file"
                id="newBackground"
                onChange={handleBackgroundChange}
              />
              <button
                style={{ margin: "0px 0 0 -55px" }}
                onClick={handleSubmitBackground}
              >
                Change Background
              </button>
            </div>
          </>
        )}
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
