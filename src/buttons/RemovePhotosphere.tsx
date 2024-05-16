import { Box } from "@mui/material";
import { useState } from "react";

import { VFE } from "../DataStructures";
import PhotosphereSelector, {
  PhotosphereSelectorProps,
} from "../PhotosphereSelector";

interface RemovePhotosphereProps {
  onClose: () => void;
  vfe: VFE;
  onRemovePhotosphere: (PhotosphereID: string) => void; // Function to remove photosphere from navigation map
}

function RemovePhotosphere({
  onClose,
  vfe,
  onRemovePhotosphere,
}: RemovePhotosphereProps): JSX.Element {
  const [selectedPhotosphere, setSelectedPhotosphere] = useState<string>("");

  // Dummy options for the PhotosphereSelector
  const options: string[] = Object.keys(vfe.photospheres);

  // Create the props for the PhotosphereSelector component
  const selectorProps: PhotosphereSelectorProps = {
    options: options,
    value: selectedPhotosphere,
    setValue: setSelectedPhotosphere,
  };

  function HandleRemovePhotosphere() {
    if (!selectedPhotosphere) {
      alert("Please select a photosphere to remove.");
      return;
    }
    onRemovePhotosphere(selectedPhotosphere);
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
      <h1>Select a Photosphere to remove</h1>
      <Box marginBottom={3}>
        <PhotosphereSelector {...selectorProps} />
      </Box>
      <button onClick={HandleRemovePhotosphere}>Remove</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default RemovePhotosphere;
