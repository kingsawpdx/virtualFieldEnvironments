import { Button, Stack, Typography } from "@mui/material";

interface RemoveHotspotProps {
  onClose: () => void;
  onRemoveHotspot: () => void;
}

function RemoveHotspot({
  onClose,
  onRemoveHotspot,
}: RemoveHotspotProps): JSX.Element {
  function handleRemoveHotspot() {
    onRemoveHotspot();
    onClose();
  }
  return (
    <Stack
      sx={{
        position: "fixed",
        zIndex: 1500,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        borderRadius: "8px",
        padding: "10px",
        width: "350px",
      }}
      spacing={1}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Remove Hotspot?
      </Typography>
      <Typography>
        The hotspot will be removed permanently and its data will be lost
      </Typography>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          paddingLeft: "50%",
          paddingTop: "20px",
        }}
      >
        <Button onClick={onClose} sx={{ width: "49%" }} variant="outlined">
          Keep
        </Button>
        <Button
          onClick={handleRemoveHotspot}
          sx={{ width: "49%" }}
          variant="contained"
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}

export default RemoveHotspot;
