import { saveAs } from "file-saver";
import JSZip, { JSZipObject } from "jszip";
import localforage from "localforage";

import { VFE } from "./DataStructures";

export async function save(vfe: VFE) {
  const zip = new JSZip();

  const assets = zip.folder("assets");
  const instance = localforage.createInstance({ name: vfe.name });
  const assetKeys = await instance.keys();

  for (const asset of assetKeys) {
    const result: Blob | null = await instance.getItem(asset);
    if (result) {
      assets?.file(asset, result);
    }
  }

  const data = JSON.stringify(vfe);
  zip.file("data.json", data);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${vfe.name}.vfe`);
}

export async function load(file: File): Promise<VFE | null> {
  const zip: JSZip = await JSZip.loadAsync(file);

  const data = await zip.file("data.json")?.async("string");
  if (!data) {
    return null;
  }
  const vfe = JSON.parse(data) as VFE;

  const instance = localforage.createInstance({ name: vfe.name });
  await instance.clear();
  const files: Record<string, JSZipObject> = {};

  const assets = zip.folder("assets");
  if (assets) {
    assets.forEach((path, file) => {
      // path is relative to current folder (assets), so should just be file name
      files[path] = file;
    });
  }

  for (const [name, file] of Object.entries(files)) {
    const blob = await file.async("blob");
    await instance.setItem(name, blob);
  }

  await localforage.setItem(vfe.name, vfe);
  return vfe;
}

export async function deleteStoredVFE(vfeID: string) {
  await localforage.dropInstance({ name: vfeID });
  await localforage.removeItem(vfeID);
}
