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

  // function to
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
