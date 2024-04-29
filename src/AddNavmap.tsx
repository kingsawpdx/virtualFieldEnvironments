import React, { useState } from "react";

import { NavMap } from "./DataStructures";

interface AddNavMapProps {
  onCreateNavMap: (navMap: NavMap) => void;
  onClose: () => void; // Function to close the AddNavMap window
}

// Calculate image dimensions by creating an image element and waiting for it to load.
// Since image loading isn't synchronous, it needs to be wrapped in a Promise.
async function calculateImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = url;
  });
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
      setNavmapImage(URL.createObjectURL(file));
    }
  }

  async function handleCreateNavMap() {
    if (navmapName.trim() === "" || !navmapImage) {
      alert("Please provide a name and select an image for the Nav Map.");
      return;
    }

    const navmapSize = 200;
    const { width, height } = await calculateImageDimensions(navmapImage);
    const maxDimension = Math.max(width, height);
    const newNavMap: NavMap = {
      src: navmapImage,
      id: navmapName,
      rotation: 0,
      defaultZoom: (navmapSize / maxDimension) * 100,
      defaultCenter: { x: width / 2, y: height / 2 },
      size: navmapSize,
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
          <button
            onClick={() => {
              void handleCreateNavMap();
            }}
          >
            Create
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddNavMap;
