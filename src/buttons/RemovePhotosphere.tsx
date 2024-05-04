import { useState } from "react";

import { VFE } from "../DataStructures";
import PhotosphereSelector, {
  PhotosphereSelectorProps,
} from "../PhotosphereSelector";

interface RemovePhotosphereProps {
  onClose: () => void;
  vfe: VFE;
}

function RemovePhotosphere({
  onClose,
  vfe,
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

  function handleRemove() {
    //Logic for removing the selected Photosphere
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
      <PhotosphereSelector {...selectorProps} />
      <button onClick={handleRemove}>Remove</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default RemovePhotosphere;
