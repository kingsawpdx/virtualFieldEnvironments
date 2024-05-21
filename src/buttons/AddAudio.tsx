import { VFE } from "../DataStructures";

function AddAudio(
  file: File | null,
  setAudio: React.Dispatch<React.SetStateAction<string>>,
  vfe: VFE,
  currPS: string,
) {
  if (file) {
    setAudio(URL.createObjectURL(file));
    vfe.photospheres[currPS].backgroundAudio = {
      tag: "Network",
      path: URL.createObjectURL(file),
    };
    return vfe;
  } else {
    // Reset the audio if no file is selected
    setAudio("");
    return vfe;
  }
}

export default AddAudio;
