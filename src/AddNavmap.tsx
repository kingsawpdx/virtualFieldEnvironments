import React, { useState } from "react";

import { NavMap } from "./DataStructures";

interface AddNavMapProps {
  onCreateNavMap: (navMap: NavMap) => void;
  onClose: () => void; // Function to close the AddNavMap window
}

function AddNavMap({ onCreateNavMap, onClose }: AddNavMapProps): JSX.Element {
  const [navmapName, setNavmapName] = useState("");
  const [navmapImage, setNavmapImage] = useState<string | null>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNavmapName(e.target.value);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setNavmapImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCreateNavMap() {
    if (navmapName.trim() === "" || !navmapImage) {
      alert("Please provide a name and select an image for the Nav Map.");
      return;
    }
    const newNavMap: NavMap = {
      src: navmapImage,
      id: navmapName,
      rotation: 0,
      defaultZoom: 0,
      hotspots: [],
    };
    onCreateNavMap(newNavMap); // Pass the new NavMap object directly
    onClose(); // Close the AddNavMap window after creating the Nav Map
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
        overflow: "hidden",
      }}
    >
      <h1>Add New Nav Map</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
      </form>
    </div>
  );
}

export default AddNavMap;
