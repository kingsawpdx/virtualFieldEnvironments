import { Box, Button, Stack, Typography } from "@mui/material";
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

  function handleRemovePhotosphere() {
    if (!selectedPhotosphere) {
      alert("Please select a photosphere to remove.");
      return;
    }
    onRemovePhotosphere(selectedPhotosphere);
    onClose();
  }

  return (
    <Stack
      sx={{
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
      <Typography variant="h5">Remove Photosphere</Typography>
      <Typography>
        Select a photosphere to remove from the list below
      </Typography>
      <Box sx={{ margin: "auto", padding: "15px 0 35px" }}>
        <PhotosphereSelector {...selectorProps} />
      </Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} sx={{ width: "49%" }} variant="outlined">
          Keep
        </Button>
        <Button
          onClick={handleRemovePhotosphere}
          sx={{ width: "49%" }}
          variant="contained"
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}

export default RemovePhotosphere;
