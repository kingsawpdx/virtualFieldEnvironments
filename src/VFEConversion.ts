import localforage from "localforage";

import {
  Asset,
  Hotspot2D,
  Hotspot3D,
  HotspotData,
  Image,
  NavMap,
  Photosphere,
  VFE,
} from "./DataStructures";

export function convertStoredToRuntime(vfeName: string): ConversionFunction {
  const instance = localforage.createInstance({ name: vfeName });

  return async (asset: Asset) => {
    if (asset.tag === "Stored") {
      const blob = await instance.getItem<Blob>(asset.id);
      if (blob === null) {
        throw new Error(`asset (${asset.id}) is missing from storage instance`);
      }

      return { tag: "Runtime", id: asset.id, path: URL.createObjectURL(blob) };
    }

    return asset;
  };
}

export function convertRuntimeToStored(vfeName: string): ConversionFunction {
  const instance = localforage.createInstance({ name: vfeName });

  return async (asset: Asset) => {
    if (asset.tag === "Runtime" && asset.path.startsWith("blob:")) {
      const result = await fetch(asset.path);
      const blob = await result.blob();
      await instance.setItem(asset.id, blob);

      return { tag: "Stored", id: asset.id, path: asset.id };
    }

    return asset;
  };
}

export type ConversionFunction = (a: Asset) => Promise<Asset>;

export async function convertVFE(
  vfe: VFE,
  convert: ConversionFunction,
): Promise<VFE> {
  const photospheres: [string, Photosphere][] = await Promise.all(
    Object.entries(vfe.photospheres).map(async ([id, p]) => [
      id,
      await convertPhotosphere(p, convert),
    ]),
  );

  return {
    ...vfe,
    photospheres: Object.fromEntries(photospheres),
    map: vfe.map ? await convertNavMap(vfe.map, convert) : undefined,
  };
}

async function convertNavMap(
  map: NavMap,
  convert: ConversionFunction,
): Promise<NavMap> {
  return { ...map, src: await convert(map.src) };
}

async function convertPhotosphere(
  photosphere: Photosphere,
  convert: ConversionFunction,
): Promise<Photosphere> {
  const hotspots: [string, Hotspot3D][] = await Promise.all(
    Object.entries(photosphere.hotspots).map(async ([id, h]) => [
      id,
      await convertHotspot3D(h, convert),
    ]),
  );

  return {
    ...photosphere,
    src: await convert(photosphere.src),
    hotspots: Object.fromEntries(hotspots),
    backgroundAudio: photosphere.backgroundAudio
      ? await convert(photosphere.backgroundAudio)
      : undefined,
  };
}

async function convertHotspot2D(
  hotspot: Hotspot2D,
  convert: ConversionFunction,
): Promise<Hotspot2D> {
  return { ...hotspot, data: await convertHotspotData(hotspot.data, convert) };
}

async function convertHotspot3D(
  hotspot: Hotspot3D,
  convert: ConversionFunction,
): Promise<Hotspot3D> {
  return {
    ...hotspot,
    icon: await convert(hotspot.icon),
    data: await convertHotspotData(hotspot.data, convert),
  };
}

async function convertImage(
  image: Image,
  convert: ConversionFunction,
): Promise<Image> {
  const hotspots: [string, Hotspot2D][] = await Promise.all(
    Object.entries(image.hotspots).map(async ([id, h]) => [
      id,
      await convertHotspot2D(h, convert),
    ]),
  );

  return {
    ...image,
    src: await convert(image.src),
    hotspots: Object.fromEntries(hotspots),
  };
}

async function convertHotspotData(
  data: HotspotData,
  convert: ConversionFunction,
): Promise<HotspotData> {
  switch (data.tag) {
    case "Image":
      return convertImage(data, convert);
    case "Audio":
    case "Video":
    case "Doc":
      return { ...data, src: await convert(data.src) };
    case "URL":
    case "Message":
    case "PhotosphereLink":
    case "Quiz":
      return data;
  }
}

export interface HotspotUpdate {
  tooltip?: string;
  data?: HotspotData;
  icon?: Asset;
}

export function updatePhotosphereHotspot(
  photosphere: Photosphere,
  hotspotPath: string[],
  update: HotspotUpdate | null,
): Photosphere {
  const hotspots: Record<string, Hotspot3D> = {};
  for (const hotspot3D of Object.values(photosphere.hotspots)) {
    const updated = updateHotspot(hotspot3D, hotspotPath, update);
    if (updated !== null) {
      // null hotspots are deleted
      hotspots[updated.id] = updated;
    }
  }

  return {
    ...photosphere,
    hotspots,
  };
}

function updateHotspot<H extends Hotspot3D | Hotspot2D>(
  hotspot: H,
  hotspotPath: string[],
  update: HotspotUpdate | null,
): H | null {
  // Found the hotspot that is being searched for.
  if (hotspotPath.length === 1 && hotspotPath[0] === hotspot.id) {
    if (update === null) {
      return null; // marked for deletion in calling function
    }

    const result = { ...hotspot };
    if (update.tooltip) {
      result.tooltip = update.tooltip;
    }
    if (update.data) {
      result.data = update.data;
    }
    if (update.icon && "icon" in result) {
      result.icon = update.icon;
    }
    return result;
  }

  if (
    hotspotPath.length === 0 || // Empty hotspot path will never be found.
    hotspotPath[0] !== hotspot.id || // First element in hotspot path is already wrong.
    hotspot.data.tag !== "Image" // Only Image hotspots have nested hotspots.
  ) {
    return hotspot;
  }

  // First path element is correct, so move on to rest of path.
  const newTargetPath = hotspotPath.slice(1);
  const hotspots: Record<string, Hotspot2D> = {};
  for (const hotspot2D of Object.values(hotspot.data.hotspots)) {
    const updated = updateHotspot(hotspot2D, newTargetPath, update);
    if (updated !== null) {
      // null hotspots are deleted
      hotspots[updated.id] = updated;
    }
  }

  return {
    ...hotspot,
    data: {
      ...hotspot.data,
      hotspots,
    },
  };
}
