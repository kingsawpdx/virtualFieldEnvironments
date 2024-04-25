import { ChangeEvent } from "react";
import { VFE } from "../DataStructures";
function AddAudio(event: ChangeEvent<HTMLInputElement>, setAudio: React.Dispatch<React.SetStateAction<string>>, vfe:VFE) {
  const file = event.target.files?.[0];
  if (file) {
    // Assuming you want to read the file content as a URL
    const reader = new FileReader();
      reader.onload = () => {
        const audioURL = reader.result as string; // Assuming the result is a string representing the URL
        setAudio(audioURL); // Set audio state to the selected file URL
        //need to add logic to add current photospheres audio to this audioURL, how can we do that?
        const currentPhotosphereId = vfe.defaultPhotosphereID;
        vfe.photospheres[currentPhotosphereId].backgroundAudio = audioURL

      }; 
    reader.readAsDataURL(file);
  } else {
    // Reset the audio if no file is selected
    setAudio("");
  }
}

export default AddAudio;
