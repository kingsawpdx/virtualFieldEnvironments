import { useEffect, useState } from "react";

import { Photosphere } from "../DataStructures";

/* -----------------------------------------------------------------------
    Add a photosphere to a Virtual Field Environment (VFE) using React.

    * Props object allows us to send the new Photosphere back to parent
    * Pass props object to AddPhotosphere function
    * Input data
    * Check for errors
    * Create newPhotosphere object
    * Pass it back to parent to update the VFE with the newPhotosphere
   ----------------------------------------------------------------------- */

export interface PhotosphereCenterFormProps {
  setPhotosphereCenter: (center: { x: number; y: number } | null) => void;
}

// Form inputs for setting the photosphere position on the map.
export function PhotosphereCenterFieldset({
  setPhotosphereCenter,
}: PhotosphereCenterFormProps) {
  const [photosphereCenterX, setPhotosphereCenterX] = useState("");
  const [photosphereCenterY, setPhotosphereCenterY] = useState("");

  useEffect(() => {
    const center = {
      x: parseFloat(photosphereCenterX),
      y: parseFloat(photosphereCenterY),
    };

    if (!isNaN(center.x) && !isNaN(center.y)) {
      setPhotosphereCenter(center);
    } else {
      setPhotosphereCenter(null);
    }
  }, [photosphereCenterX, photosphereCenterY, setPhotosphereCenter]);

  return (
    <fieldset>
      <legend>Photosphere Map Position (Optional):</legend>
      <div>
        <label htmlFor="photosphereCenterX">X Coordinate:</label>
        <input
          type="number"
          id="photosphereCenterX"
          value={photosphereCenterX}
          onChange={(e) => {
            setPhotosphereCenterX(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="photosphereCenterY">Y Coordinate:</label>
        <input
          type="number"
          id="photosphereCenterY"
          value={photosphereCenterY}
          onChange={(e) => {
            setPhotosphereCenterY(e.target.value);
          }}
        />
      </div>
    </fieldset>
  );
}

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
  const [photosphereCenter, setPhotosphereCenter] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Add image data
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPanoImage(URL.createObjectURL(file));
    }
  }

  // Add audio data
  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
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
      center: photosphereCenter ?? undefined,
      hotspots: {},
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
        <PhotosphereCenterFieldset
          setPhotosphereCenter={setPhotosphereCenter}
        />
        <button type="button" onClick={handlePhotosphereAdd}>
          Add Photosphere
        </button>
      </form>
    </div>
  );
}

export default AddPhotosphere;
