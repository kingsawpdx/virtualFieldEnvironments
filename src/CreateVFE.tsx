import React, { useState } from "react";
import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import AppRoot from "./App.tsx";


interface CreateVFEFormProps {
  onCreateVFE: (data: VFE) => void;
}

const CreateVFEForm: React.FC<CreateVFEFormProps> = ({ onCreateVFE }) => {
  const [vfeName, setVFEName] = useState("");
  const [panoImage, setPanoImage] = useState("");

  const handleCreateVFE = () => {
    if (vfeName.trim() === "" || !panoImage) {
      alert("Please provide a VFE name and select a panorama image.");
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
      defaultPhotosphereID: "default", // Placeholder for default photosphere ID
      photospheres: {
        default: {
          id: "default", // Placeholder for photosphere ID
          src: panoImage, // Panorama image provided by the user
          center: { x: 0, y: 0 }, // Placeholder for panorama center
          hotspots: [], // Placeholder for photosphere hotspots
        },
      },
    };
    onCreateVFE(data);
    // Reset form fields after creating the VFE
    //setVFEName("");
    //setPanoImage("");
    return data;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURL = reader.result as string;
        setPanoImage(imageURL)
      }
      reader.readAsDataURL(file)
    }
  };

  return (
    <div>
      <h2>Create a New Virtual Field Environment (VFE)</h2>
      <div>
        <label htmlFor="vfeName">VFE Name:</label>
        <input
          type="text"
          id="vfeName"
          value={vfeName}
          onChange={(e) => setVFEName(e.target.value)}
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
};

export default CreateVFEForm;
