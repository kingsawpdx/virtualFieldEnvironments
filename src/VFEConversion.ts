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

export async function convertLocalToNetwork(asset: Asset): Promise<Asset> {
  let path = asset.path;
  if (path.startsWith("data:")) {
    const result = await fetch(asset.path);
    const blob = await result.blob();
    path = URL.createObjectURL(blob);
  }
  return { tag: "Network", path };
}

export async function convertNetworkToLocal(asset: Asset): Promise<Asset> {
  let path = asset.path;
  if (path.startsWith("blob:")) {
    const result = await fetch(asset.path);
    const blob = await result.blob();
    path = await convertBlobToData(blob);
  }
  return { tag: "Local", path };
}

async function convertBlobToData(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const URL = reader.result as string;
      resolve(URL);
    };
    reader.readAsDataURL(blob);
  });
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
  return { ...hotspot, data: await convertHotspotData(hotspot.data, convert) };
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
      return { ...data, src: await convert(data.src) };
    case "URL":
    case "Doc":
    case "PhotosphereLink":
      return data;
  }
}
