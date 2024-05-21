import { VFE } from "../DataStructures";

function AddAudio(
  file: File | null,
  setAudio: React.Dispatch<React.SetStateAction<string>>,
  vfe: VFE,
) {
  if (file) {
    setAudio(URL.createObjectURL(file));
    const currentPhotosphereId = vfe.defaultPhotosphereID;
    vfe.photospheres[currentPhotosphereId].backgroundAudio = {
      tag: "Network",
      path: URL.createObjectURL(file),
    };
  } else {
    // Reset the audio if no file is selected
    setAudio("");
  }
}

export default AddAudio;
