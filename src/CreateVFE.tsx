import React, { useState } from "react";

import { VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

/* -----------------------------------------------------------------------
    Create a Virtual Field Environment (VFE) that will contain many 
    Photospheres.

    * Props object allows us to send the new Photosphere back to parent
    * Pass props object to AddPhotosphere function
    * Input data
    * Check for errors
    * Create newPhotosphere object
    * Pass it back to parent to update the VFE with the newPhotosphere
   ----------------------------------------------------------------------- */

// Properties passed down from parent
interface CreateVFEFormProps {
  onCreateVFE: (data: VFE) => void;
}

// Add a new VFE
function CreateVFEForm({ onCreateVFE }: CreateVFEFormProps) {
  // Base states
  const [vfeName, setVFEName] = useState("");
  const [photosphereName, setPhotosphereName] = useState(""); // State for Photosphere Name
  const [panoImage, setPanoImage] = useState("");

  // Error Handling: Ensure the data is not empty
  function handleCreateVFE() {
    if (vfeName.trim() === "" || photosphereName.trim() === "" || !panoImage) {
      alert("Please, provide a VFE name, Photosphere name, and an image.");
      return;
    }
    // Input data into new VFE
    const data: VFE = {
      name: vfeName,
      map: {
        src: "",
        rotation: 0,
        defaultZoom: 0,
        hotspots: [],
      },
      defaultPhotosphereID: photosphereName,
      photospheres: {
        [photosphereName]: {
          id: photosphereName,
          src: panoImage,
          center: { x: 0, y: 0 },
          hotspots: {},
        },
      },
    };
    onCreateVFE(data);
    return <PhotosphereViewer vfe={data} />;
  }

  // Ensure file is truthy
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result as string;
        setPanoImage(imageURL);
      };
      reader.readAsDataURL(file);
    }
  }
  // Add styling to input interface
  return (
    <div>
      <h2>Create a New Virtual Field Environment (VFE)</h2>
      <div>
        <label htmlFor="vfeName">VFE Name:</label>
        <input
          type="string"
          id="vfeName"
          value={vfeName}
          onChange={(e) => {
            setVFEName(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="photosphereName">Photosphere Name:</label>
        <input
          type="string"
          id="photosphereName"
          value={photosphereName}
          onChange={(e) => {
            setPhotosphereName(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="panoImage">Panorama Image:</label>
        <input
          type="file"
          id="panoImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button onClick={handleCreateVFE}>Create VFE</button>
    </div>
  );
}

export default CreateVFEForm;
