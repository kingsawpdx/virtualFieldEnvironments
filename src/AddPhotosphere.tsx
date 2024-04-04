import { useState } from "react";

import { Photosphere, VFE } from "./DataStructures";

interface AddPhotosphereProps {
  vfe: VFE;
}

function AddPhotosphere({ vfe }: AddPhotosphereProps): JSX.Element {
  console.log("Accessing VFE data in AddPhotosphere:", vfe);
  const [photosphereID, setPhosphereID] = useState("");
  const [panoImage, setPanoImage] = useState("");
  const [audioFile, setAudiofile] = useState("");

  // function to handle add photosphere 
  const handlePhotosphereAdd = () => {
    // error handling: check to make sure non-null values are inputted
    if (!photosphereID || !panoImage) {
      alert("Must provide Photo Sphere name and source file.");
      return;
    }
    // If valid input, create  a new photosphere object
    const newPhotosphere: Photosphere = {
      id: photosphereID,
      src: panoImage,
      center: { x: 0, y: 0 },
      hotspots: [],
      backgroundAudio: audioFile // or null if not included
    };

    // Add the new photosphere to VFE
    vfe.photospheres[photosphereID] = newPhotosphere;

    // Reset the form fields after adding the photosphere
    // can't set state to null
    // setPhotosphereID("");
    // setPanoImage(null);
    // setAudioFile(null);
  };
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
      <h1>New Photosphere</h1>
      <div>
        <label htmlFor="photosphereID">Photosphere Name:</label>
        <input type="text" id="photosphereID" />
      </div>
      <div>
        <label htmlFor="panoImage">Panoramic Image:</label>
        <input type="file" id="panoImage" accept="image/*" />
      </div>
      <div>
        <label htmlFor="audioFile">Background Audio:</label>
        <input type="file" id="audioFile" accept="audio/*" />
      </div>
      {/* This should call a function to add the photosphere to the VFE */}
      <button>Add Photosphere</button>
    </div>
  );
  // popover
}

export default AddPhotosphere;
