import { saveAs } from "file-saver";
import JSZip from "jszip";
import localforage from "localforage";

import { VFE } from "./DataStructures";

export async function save(vfe: VFE) {
  const zip = new JSZip();

  const assets = zip.folder("assets");
  const instance = localforage.createInstance({ name: vfe.name });
  const assetKeys = await instance.keys();

  for (const asset in assetKeys) {
    const result: Blob | null = await instance.getItem(asset);
    if (result) {
      assets?.file(asset, result);
    }
  }

  const data = JSON.stringify(vfe);
  zip.file("data.json", data);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${vfe.name}.zip`);
}

export async function load(file: File): Promise<VFE | null> {
  const zip: JSZip = await JSZip.loadAsync(file);
  const data = await zip.file("data.json")?.async("string");
  if (data) {
    const localVFE = JSON.parse(data) as VFE;
    return localVFE;
  }
  return null;
}

export async function deleteStoredVFE(vfeID: string) {
  await localforage.removeItem(vfeID);
}
