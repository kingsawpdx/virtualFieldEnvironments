import React, { useState } from "react";

import { VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";

interface CreateVFEFormProps {
  onCreateVFE: (data: VFE) => void;
}

function CreateVFEForm({ onCreateVFE }: CreateVFEFormProps) {
  const [vfeName, setVFEName] = useState("");
  const [photosphereName, setPhotosphereName] = useState(""); // State for Photosphere Name
  const [panoImage, setPanoImage] = useState("");

  function handleCreateVFE() {
    if (vfeName.trim() === "" || photosphereName.trim() === "" || !panoImage) {
      alert(
        "Please provide a VFE name, a Photosphere name, and select a panorama image.",
      );
      return;
    }
    const data: VFE = {
      name: vfeName,
      map: {
        src: "", // Placeholder for map image
        rotation: 0, // Placeholder for map rotation
        defaultZoom: 0, // Placeholder for default zoom
        hotspots: [], // Placeholder for map hotspots
      },
      defaultPhotosphereID: photosphereName, // Use Photosphere Name for default Photosphere ID
      photospheres: {
        [photosphereName]: {
          id: photosphereName, // Use Photosphere Name for Photosphere ID
          src: panoImage, // Panorama image provided by the user
          center: { x: 0, y: 0 }, // Placeholder for panorama center
          hotspots: [], // Placeholder for photosphere hotspots
        },
      },
    };
    onCreateVFE(data);
    // Reset form fields after creating the VFE
    //setVFEName("");
    //setPhotosphereName(""); // Reset Photosphere Name
    //setPanoImage("");
    return <PhotosphereViewer vfe={data} />;
  }

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
