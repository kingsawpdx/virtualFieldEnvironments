import { ChangeEvent } from "react";

import { VFE } from "../DataStructures";

function AddAudio(
  event: ChangeEvent<HTMLInputElement>,
  setAudio: React.Dispatch<React.SetStateAction<string>>,
  vfe: VFE,
) {
  const file = event.target.files?.[0];
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
