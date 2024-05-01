import { saveAs } from "file-saver";
import JSZip from "jszip";

import { VFE } from "./DataStructures";

export async function save(vfe: VFE) {
  var zip = new JSZip();
  const data = JSON.stringify(vfe);
  zip.file("data.json", data);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "vfe.zip");
}
