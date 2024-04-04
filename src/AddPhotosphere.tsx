import { useState } from "react";

import { Photosphere } from "./DataStructures";

interface AddPhotosphereProps {
  onAddPhotosphere: (newPhotosphere: Photosphere) => void;
}

function AddPhotosphere({
  onAddPhotosphere,
}: AddPhotosphereProps): JSX.Element {
  const [photosphereID, setPhotosphereID] = useState("");
  const [panoImage, setPanoImage] = useState("");
  const [audioFile, setAudioFile] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setPanoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setAudioFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePhotosphereAdd() {
    if (!photosphereID || !panoImage) {
      alert("Must provide a Photosphere name and source file.");
      return;
    }
    const newPhotosphere: Photosphere = {
      id: photosphereID,
      src: panoImage,
      center: { x: 0, y: 0 },
      hotspots: [],
      backgroundAudio: audioFile,
    };

    onAddPhotosphere(newPhotosphere);

    // Optionally reset the form fields after adding the photosphere
    setPhotosphereID("");
    setPanoImage("");
    setAudioFile("");
  }

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
