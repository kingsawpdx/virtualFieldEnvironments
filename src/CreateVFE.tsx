import React, { useState } from "react";

interface CreateVFEFormProps {
  onCreateVFE: (vfeName: string, panoImage: File) => void;
}

const CreateVFEForm: React.FC<CreateVFEFormProps> = ({ onCreateVFE }) => {
  const [vfeName, setVFEName] = useState("");
  const [panoImage, setPanoImage] = useState<File | null>(null);

  const handleCreateVFE = () => {
    // Here you can perform any necessary validation before creating the VFE
    // For simplicity, we're just checking if the VFE name is not empty and an image is selected
    if (vfeName.trim() === "" || !panoImage) {
      alert("Please provide a VFE name and select a panorama image.");
      return;
    }

    // Assuming you have a function to create a VFE and you pass the name and image to it
    onCreateVFE(vfeName, panoImage);

    // Reset form fields after creating the VFE
    setVFEName("");
    setPanoImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // You can perform additional checks here if needed
    if (file) {
      setPanoImage(file);
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
