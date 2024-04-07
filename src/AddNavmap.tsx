import React, { useState } from "react";
import {NavMap} from "./DataStructures";

interface AddNavMapProps {
  onCreateNavMap: (navMap: NavMap) => void;
  onClose: () => void; // Function to close the AddNavMap window
  
}

function AddNavMap({ onCreateNavMap, onClose }: AddNavMapProps): JSX.Element {
  const [navmapName, setNavmapName] = useState("");
  const [navmapImage, setNavmapImage] = useState<File | null>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNavmapName(e.target.value);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setNavmapImage(file);
    }
  }

  function handleCreateNavMap() {
    if (navmapName.trim() === "" || !navmapImage) {
      alert("Please provide a name and select an image for the Nav Map.");
      return;
    }
  const newNavMap: NavMap = {
    src: URL.createObjectURL(navmapImage),
    rotation: 0,
    defaultZoom: 0,
    hotspots: [],
  };
    onCreateNavMap(newNavMap); // Pass the new NavMap object directly
    onClose(); // Close the AddNavMap window after creating the Nav Map
  }

  return (
    <div>
      <h2>Add New Nav Map</h2>
      <div>
        <label htmlFor="navmapName">Nav Map Name:</label>
        <input
          type="text"
          id="navmapName"
          value={navmapName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <label htmlFor="navmapImage">Upload Image:</label>
        <input
          type="file"
          id="navmapImage"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <button onClick={handleCreateNavMap}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddNavMap;
