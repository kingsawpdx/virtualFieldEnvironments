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
    <div
      style={{
        position: "fixed",
        zIndex: 1500,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      <h1>Remove Hotspot</h1>
      <p>Are you sure you want to remove this hotspot?</p>
      <button onClick={handleRemoveHotspot}>Yes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default RemoveHotspot;
