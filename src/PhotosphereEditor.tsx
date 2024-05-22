import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import { deleteStoredVFE, save } from "./FileOperations.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import { convertNetworkToLocal, convertVFE } from "./VFEConversion.ts";
import AddAudio from "./buttons/AddAudio.tsx";
import AddHotspot from "./buttons/AddHotspot.tsx";
import AddNavmap from "./buttons/AddNavmap";
import AddPhotosphere from "./buttons/AddPhotosphere.tsx";
import EditNavMap from "./buttons/EditNavMap.tsx";
import RemoveHotspot from "./buttons/RemoveHotspot.tsx";
import RemoveNavMap from "./buttons/RemoveNavmap.tsx";
import RemovePhotosphere from "./buttons/RemovePhotosphere.tsx";

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
  vfe: VFE;
  onUpdateVFE: (updatedVFE: VFE) => void;
  currentPS: string;
  onChangePS: (id: string) => void;
}

// If an update is triggered, add newPhotosphere, and update VFE
function PhotosphereEditor({
  vfe,
  onUpdateVFE,
  currentPS,
  onChangePS,
}: PhotosphereEditorProps): JSX.Element {
  const navigate = useNavigate();
  // Base states
  const [showAddPhotosphere, setShowAddPhotosphere] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showAddNavMap, setShowAddNavMap] = useState(false); // State to manage whether to show AddNavmap

  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);

  const [showAddFeatures, setShowAddFeatures] = useState(false);
  const [showChangeFeatures, setShowChangeFeatures] = useState(false);
  const [showRemoveFeatures, setShowRemoveFeatures] = useState(false);

  const [newName, setNewName] = useState(""); // State to hold the new name
  const [newBackground, setNewBackground] = useState("");
  const [audio, setAudio] = useState<string>("");

  const [showRemovePhotosphere, setShowRemovePhotosphere] = useState(false);
  const [showRemoveNavMap, setShowRemoveNavMap] = useState(false);
  const [showRemoveHotspot, setShowRemoveHotspot] = useState(false);
  const [hotspotToRemove, setHotspotToRemove] = useState<string | null>(null);
  const [showEditNavMap, setShowEditNavMap] = useState(false);
  console.log(vfe);

  // Change URL to reflect current photosphere

  function handleEditNavMap(updatedPhotospheres: Record<string, Photosphere>) {
    const updatedVFE: VFE = {
      ...vfe,
      photospheres: updatedPhotospheres,
    };

    onUpdateVFE(updatedVFE);
    setShowEditNavMap(false);
    setUpdateTrigger((prev) => prev + 1);
  }

  function handleRemoveHotspotClick(hotspotToRemove: string) {
    setHotspotToRemove(hotspotToRemove);
    setShowRemoveHotspot(true);
  }

  function handleRemoveHotspotConfirm() {
    if (hotspotToRemove) {
      const updatedPhotosphere = { ...vfe.photospheres[currentPS] };

      // Create a new object without the hotspot to remove

      const { [hotspotToRemove]: _removed, ...remainingHotspots } =
        updatedPhotosphere.hotspots;

      // Update the photosphere with the remaining hotspots
      const updatedPhotosphereWithHotspots = {
        ...updatedPhotosphere,
        hotspots: remainingHotspots,
      };

      const updatedVFE = {
        ...vfe,
        photospheres: {
          ...vfe.photospheres,
          [currentPS]: updatedPhotosphereWithHotspots,
        },
      };

      //setVFE(updatedVFE); // Update the local VFE state
      onUpdateVFE(updatedVFE); // Propagate the change to the parent component
      setShowRemoveHotspot(false); // Close the RemoveHotspot component
      setHotspotToRemove(null);
      setUpdateTrigger((prev) => prev + 1);
    }
  }

  async function handleRemovePhotosphere(photosphereId: string) {
    if (!photosphereId) {
      alert("Photosphere not found.");
      return;
    }

    // Create a new object without the removed photosphere
    const remainingPhotospheres = Object.fromEntries(
      Object.entries(vfe.photospheres).filter(([key]) => key !== photosphereId),
    );

    if (Object.keys(remainingPhotospheres).length === 0) {
      // No more photospheres available
      if (
        confirm(
          "This is the last photosphere. The VFE will be deleted and you will return to the home page. Continue?",
        )
      ) {
        await deleteStoredVFE(vfe.name);
        navigate("/"); // Redirect to home
      }
      return;
    }

    // nextPhotosphereId will never be undefined
    const nextPhotosphereId = Object.keys(remainingPhotospheres)[0];

    const newDefaultPhotosphereID =
      photosphereId === vfe.defaultPhotosphereID
        ? nextPhotosphereId
        : vfe.defaultPhotosphereID;

    const updatedVFE: VFE = {
      ...vfe,
      photospheres: updatePhotospheres(
        remainingPhotospheres,
        photosphereId,
        null,
      ),
      defaultPhotosphereID: newDefaultPhotosphereID,
    };

    //setVFE(updatedVFE);
    onUpdateVFE(updatedVFE);
    // After updating the state
    setUpdateTrigger((prev) => prev + 1);
    if (photosphereId !== newDefaultPhotosphereID) {
      onChangePS(newDefaultPhotosphereID); // Navigate to the new or remaining default photosphere
    } else {
      onChangePS(nextPhotosphereId);
    }
    handleCloseRemovePhotosphere();
  }

  // Update the VFE
  function handleAddPhotosphere(newPhotosphere: Photosphere) {
    const updatedVFE: VFE = {
      ...vfe,
      photospheres: {
        ...vfe.photospheres,
        [newPhotosphere.id]: newPhotosphere,
      },
    };
    onUpdateVFE(updatedVFE); // Propagate the change to the AppRoot
    onChangePS(newPhotosphere.id); // Switch to new photosphere
    setShowAddPhotosphere(false);
    setUpdateTrigger((prev) => prev + 1);
  }
  function handleCreateNavMap(updatedNavMap: NavMap) {
    const updatedVFE: VFE = {
      ...vfe,
      map: updatedNavMap,
    };
    onUpdateVFE(updatedVFE); // Propagate the change to the parent component
    setShowAddNavMap(false); // Close the AddNavMap component
    setUpdateTrigger((prev) => prev + 1);
  }

  function handleAddHotspot(newHotspot: Hotspot3D) {
    const photosphere: Photosphere = vfe.photospheres[currentPS];

    photosphere.hotspots[newHotspot.tooltip] = newHotspot;

    onUpdateVFE(vfe);
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
    setShowRemoveNavMap(false);
    setShowRemovePhotosphere(false);
    setShowEditNavMap(false);
    setPitch(0);
    setYaw(0);
  }

  // This function is where we render the actual component based on the useState
  function ActiveComponent() {
    if (showAddPhotosphere)
      return (
        <AddPhotosphere
          onAddPhotosphere={handleAddPhotosphere}
          onCancel={resetStates}
        />
      );
    if (showAddNavMap)
      return (
        <AddNavmap onCreateNavMap={handleCreateNavMap} onClose={resetStates} />
      );
    if (showEditNavMap)
      return (
        <EditNavMap
          onClose={resetStates}
          vfe={vfe}
          onUpdateVFE={handleEditNavMap}
        />
      );
    if (showAddHotspot)
      return (
        <AddHotspot
          onCancel={resetStates}
          onAddHotspot={handleAddHotspot}
          pitch={pitch}
          yaw={yaw}
        />
      );
    if (showRemovePhotosphere)
      return (
        <RemovePhotosphere
          onRemovePhotosphere={(id) => {
            void handleRemovePhotosphere(id);
          }}
          onClose={handleCloseRemovePhotosphere}
          vfe={vfe}
        />
      );
    if (showRemoveNavMap)
      return (
        <RemoveNavMap
          onClose={handleCloseRemoveNavMap}
          onRemoveNavmap={handleRemoveNavMap}
        />
      );
    if (showRemoveHotspot)
      return (
        <RemoveHotspot
          onClose={handleCloseHotspotRemove}
          onRemoveHotspot={handleRemoveHotspotConfirm}
        />
      );
    return null;
  }

  async function handleExport() {
    const convertedVFE = await convertVFE(vfe, convertNetworkToLocal);
    await save(convertedVFE);
  }

  function handleAudioChange(event: React.ChangeEvent<HTMLInputElement>) {
    AddAudio(event, setAudio, vfe); // Call the AddAudio function to handle audio change
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

  // Function to handle clicking on the "Remove photosphere" button
  function handleRemovePhotosphereClick() {
    setShowRemovePhotosphere(true);
    // Set the state to true to show the RemovePhotosphere component
  }

  // Function to handle closing the RemovePhotosphere component
  function handleCloseRemovePhotosphere() {
    setShowRemovePhotosphere(false); // Set the state to false to hide the RemovePhotosphere component
  }

  function handleCloseHotspotRemove() {
    setShowRemoveHotspot(false);
  }

  function handleCloseRemoveNavMap() {
    setShowRemoveNavMap(false);
  }
  /*
  function handleCloseEditNavMap() {
    setUpdateTrigger((prev) => prev + 1);
    setShowEditNavMap(false);
  }
*/
  function handleRemoveNavMap() {
    const updatedVFE: VFE = {
      ...vfe,
      map: undefined,
    };
    //setVFE(updatedVFE); // Update the local VFE state
    onUpdateVFE(updatedVFE); // Propagate the change to the parent component
    setShowRemoveNavMap(false); // Close the RemoveNavMap component
    setUpdateTrigger((prev) => prev + 1);
    //setShowRemoveNavMap(true);
  }

  function updateHotspots(
    photosphere: Photosphere,
    oldPhotosphereID: string,
    newPhotosphereID: string | null,
  ): Photosphere {
    const hotspots: Record<string, Hotspot3D> = {};

    // iterate through hotspots in the current ps
    for (const [id, hotspot] of Object.entries(photosphere.hotspots)) {
      if (
        hotspot.data.tag === "PhotosphereLink" &&
        hotspot.data.photosphereID === oldPhotosphereID
      ) {
        if (newPhotosphereID !== null) {
          hotspots[id] = {
            ...hotspot,
            data: { tag: "PhotosphereLink", photosphereID: newPhotosphereID },
          };
        }
      } else {
        hotspots[id] = hotspot;
      }
    }

    return { ...photosphere, hotspots };
  }

  function updatePhotospheres(
    photospheres: Record<string, Photosphere>,
    oldPhotosphereID: string,
    newPhotosphereID: string | null,
  ): Record<string, Photosphere> {
    return Object.fromEntries(
      Object.entries(photospheres)
        .filter(([key]) => key !== currentPS)
        .map(([key, photosphere]) => {
          // update hotspots in the current photosphere
          const updatedPhotosphere = updateHotspots(
            photosphere,
            oldPhotosphereID,
            newPhotosphereID,
          );
          return [key, updatedPhotosphere];
        }),
    );
  }

  // Function to handle submit button click for name change
  function handleSubmitName() {
    if (newName.trim() !== "") {
      const currentPhotosphere = vfe.photospheres[currentPS];

      //making updated photosphere list minus the currentPS
      const updatedPhotospheres: Record<string, Photosphere> =
        updatePhotospheres(vfe.photospheres, currentPS, newName);

      //making currentPS entry with newName
      updatedPhotospheres[newName] = { ...currentPhotosphere, id: newName };

      const updatedDefaultPhotosphereID =
        vfe.defaultPhotosphereID === currentPS
          ? newName
          : vfe.defaultPhotosphereID;

      const updatedVFE: VFE = {
        ...vfe,
        defaultPhotosphereID: updatedDefaultPhotosphereID,
        photospheres: updatedPhotospheres,
      };

      onChangePS(newName); //set currentPS index to new name to access it correctly moving forward

      onUpdateVFE(updatedVFE);
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
        src: { tag: "Network", path: newBackground },
      };

      const updatedVFE: VFE = {
        ...vfe,
        photospheres: updatedPhotospheres,
      };

      onUpdateVFE(updatedVFE);
      setUpdateTrigger((prev) => prev + 1);
    }
    setNewBackground("");
  }

  return (
    <Box sx={{ height: "100vh" }}>
      <Stack
        sx={{
          position: "absolute",
          zIndex: 1000,
          left: "20px",
          top: "20px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {!showAddFeatures && !showChangeFeatures && !showRemoveFeatures && (
          <>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                setShowAddFeatures(true);
              }}
              variant="contained"
            >
              Add Features
            </Button>
            <Button
              sx={{
                margin: "10px 0",
              }}
              onClick={() => {
                setShowChangeFeatures(true);
              }}
              variant="contained"
            >
              Change Features
            </Button>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                setShowRemoveFeatures(true);
              }}
              variant="contained"
            >
              Remove Features
            </Button>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                void handleExport();
              }}
              variant="contained"
            >
              Export
            </Button>
          </>
        )}
        {showAddFeatures && (
          <>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                resetStates();
                setShowAddPhotosphere(true);
              }}
              variant="contained"
            >
              Add New Photosphere
            </Button>

            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                resetStates();
                setShowAddNavMap(true); // Set state to show AddNavmap
                //Call your setShowAddNavmap function to set the state and display the function
              }}
              variant="contained"
            >
              {vfe.map ? "Change NavMap" : "Add New NavMap"}
            </Button>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                resetStates();
                //Call your setShowAddHotspot function to set the state and display the function
                setShowAddHotspot(true);
              }}
              variant="contained"
            >
              Add New Hotspot
            </Button>

            <label htmlFor="audio">
              {audio !== "" ||
              vfe.photospheres[vfe.defaultPhotosphereID].backgroundAudio
                ? "Change Audio: "
                : "Add Audio:"}
            </label>
            <input type="file" id="audio" onChange={handleAudioChange} />
            <Button
              sx={{ margin: "10" }}
              onClick={() => {
                setShowAddFeatures(false);
              }}
              variant="outlined"
            >
              Back
            </Button>
          </>
        )}

        {showRemoveFeatures && (
          <>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                setShowRemoveNavMap(true);
                //remove nav map
              }}
              variant="contained"
            >
              Remove nav map
            </Button>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                //remove photosphere
                handleRemovePhotosphereClick();
              }}
              variant="contained"
            >
              Remove photosphere
            </Button>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                setShowRemoveFeatures(false);
              }}
            >
              Back
            </Button>
          </>
        )}

        {showChangeFeatures && (
          <>
            <Button
              sx={{ margin: "10px 470px 0 0" }}
              onClick={() => {
                setShowChangeFeatures(false);
              }}
              variant="outlined"
            >
              Back
            </Button>
            {/* Buttons for changing features */}
            <div style={{ margin: "10px 0" }}>
              <label htmlFor="newName">New Photosphere Name: </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={handleNameChange}
              />
              <Button
                sx={{ margin: "0px 5px 0 8px" }}
                onClick={handleSubmitName}
                variant="contained"
              >
                Change Name
              </Button>
            </div>
            <div style={{ margin: "10px 0" }}>
              <label htmlFor="newBackground">New Background: </label>
              <input
                type="file"
                id="newBackground"
                onChange={handleBackgroundChange}
              />
              <Button
                sx={{ margin: "0px 0 0 -55px" }}
                onClick={handleSubmitBackground}
                variant="contained"
              >
                Change Background
              </Button>
            </div>
            <Button
              sx={{ margin: "10px 0" }}
              onClick={() => {
                resetStates();
                setShowEditNavMap(true); // Set state to show EditNavmap
              }}
              variant="contained"
            >
              Edit NavMap
            </Button>
          </>
        )}
      </Stack>
      <Box style={{ width: "100%", height: "100%" }}>
        <PhotosphereViewer
          currentPS={currentPS}
          onChangePS={onChangePS}
          onViewerClick={handleLocation}
          key={updateTrigger}
          vfe={vfe}
          onRemoveHotspot={handleRemoveHotspotClick}
        />
        <ActiveComponent />
      </Box>
    </Box>
  );
}

export default PhotosphereEditor;
