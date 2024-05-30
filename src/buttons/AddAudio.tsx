import { VFE, newID } from "../DataStructures";

function AddAudio(file: File | null, vfe: VFE, currPS: string) {
  if (file) {
    vfe.photospheres[currPS].backgroundAudio = {
      tag: "Runtime",
      id: newID(),
      path: URL.createObjectURL(file),
    };
  }

  return vfe;
}

export default AddAudio;
