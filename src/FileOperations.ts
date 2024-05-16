import { saveAs } from "file-saver";
import JSZip from "jszip";
import localforage from "localforage";

import { VFE } from "./DataStructures";

export async function save(vfe: VFE) {
  const zip = new JSZip();
  const data = JSON.stringify(vfe);
  zip.file("data.json", data);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${vfe.name}.zip`);
}

export async function deleteStoredVFE(vfeID: string) {
  await localforage.removeItem(vfeID);
}
