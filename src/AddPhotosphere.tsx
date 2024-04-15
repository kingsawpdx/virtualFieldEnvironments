import { useState } from "react";

import { Photosphere } from "./DataStructures";

/* -----------------------------------------------------------------------
    Add a photosphere to a Virtual Field Environment (VFE) using React.

    * Props object allows us to send the new Photosphere back to parent
    * Pass props object to AddPhotosphere function
    * Input data
    * Check for errors
    * Create newPhotosphere object
    * Pass it back to parent to update the VFE with the newPhotosphere
   ----------------------------------------------------------------------- */

// Properties passed down from parent
interface AddPhotosphereProps {
  onAddPhotosphere: (newPhotosphere: Photosphere) => void;
}

// Create new photosphere
function AddPhotosphere({
  onAddPhotosphere,
}: AddPhotosphereProps): JSX.Element {
  // Base states
  const [photosphereID, setPhotosphereID] = useState("");
  const [panoImage, setPanoImage] = useState("");
  const [audioFile, setAudioFile] = useState("");

  // Add image data
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setPanoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Add audio data
  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setAudioFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Error handling: check to see if required data != null
  function handlePhotosphereAdd() {
    if (!photosphereID || !panoImage) {
      alert("Please, provide a name and source file.");
      return;
    }

    // Create new photosphere object
    const newPhotosphere: Photosphere = {
      id: photosphereID,
      src: panoImage,
      center: { x: 0, y: 0 },
      hotspots: [],
      backgroundAudio: audioFile,
    };

    // Pass newPhotosphere back to parent to update VFE
    onAddPhotosphere(newPhotosphere);

    // Reset the form fields after adding the photosphere
    setPhotosphereID("");
    setPanoImage("");
    setAudioFile("");
  }
  // Add styling for inputting information
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1050,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <h1>Add New Photosphere</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="photosphereID">Photosphere Name:</label>
          <input
            type="text"
            id="photosphereID"
            value={photosphereID}
            onChange={(e) => {
              setPhotosphereID(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="panoImage">Panoramic Image:</label>
          <input
            type="file"
            id="panoImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label htmlFor="audioFile">Background Audio (optional):</label>
          <input
            type="file"
            id="audioFile"
            accept="audio/*"
            onChange={handleAudioChange}
          />
        </div>
        <button type="button" onClick={handlePhotosphereAdd}>
          Add Photosphere
        </button>
      </form>
    </div>
  );
}

export default AddPhotosphere;
