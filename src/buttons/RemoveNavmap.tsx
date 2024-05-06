//import { useState } from "react";
import { NavMap } from "../DataStructures";

interface RemoveNavMapProps {
  onClose: () => void;
  onRemoveNavmap: (navMap: NavMap) => void;
}

function RemoveNavMap({
  onClose,
  onRemoveNavmap,
}: RemoveNavMapProps): JSX.Element {
  function HandleRemoveNavmap() {
    // Remove the current navigation map from the VFE object
    const newNavMap: NavMap = {
      src: { tag: "Network", path: "" },
      id: "",
      rotation: 0,
      defaultZoom: 0,
      defaultCenter: { x: 0, y: 0 },
      size: 0,
    };
    onRemoveNavmap(newNavMap);

    // Close the remove navigation map dialog
    onClose();
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
      <h1>Remove Navigation Map</h1>
      <p>Are you sure you want to remove the current navigation map?</p>
      <button onClick={HandleRemoveNavmap}>Remove</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default RemoveNavMap;
