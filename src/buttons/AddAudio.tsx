import { VFE } from "../DataStructures";

function AddAudio(file: File | null, vfe: VFE, currPS: string) {
  if (file) {
    vfe.photospheres[currPS].backgroundAudio = {
      tag: "Network",
      path: URL.createObjectURL(file),
    };
  }

  return vfe;
}

export default AddAudio;
