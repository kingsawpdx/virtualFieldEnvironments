/* -----------------------------------------------------------------------
                    Virtual Field Environment Software
   -----------------------------------------------------------------------
    Instantiation of the objects that will be used for interacting with
    Photo Sphere Viewer to build a virtual geology field guide.
    Order listed from big-picture environment collection
    to micro-environments and associated elements.
   ----------------------------------------------------------------------- */

export function newID() {
  return crypto.randomUUID();
}

// Calculate image dimensions by creating an image element and waiting for it to load.
// Since image loading isn't synchronous, it needs to be wrapped in a Promise.
export async function calculateImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = url;
  });
}

export interface LocalAsset {
  tag: "Local";
  path: string;
}

export interface NetworkAsset {
  tag: "Network";
  path: string;
}

export type Asset = LocalAsset | NetworkAsset;

// Virtual Field Environment: the total collection of photosphere environments
export interface VFE {
  name: string;
  map?: NavMap;
  defaultPhotosphereID: string;
  photospheres: Record<string, Photosphere>;
}

// Navigation map: a birdseye view of the various hotspots within a single 360-environment
export interface NavMap {
  src: Asset;
  id: string;
  rotation: number;
  defaultZoom: number;
  defaultCenter: { x: number; y: number };
  size: number;
}

// Photosphere: a single 360-environment
export interface Photosphere {
  id: string;
  src: Asset;
  hotspots: Record<string, Hotspot3D>;
  center?: { x: number; y: number };
  backgroundAudio?: Asset;
}

// Hotspot2D: a clickable resource that is inside a 2D image (x, y)
export interface Hotspot2D {
  x: number;
  y: number;
  id: string;
  tooltip: string;
  color: string;
  data: HotspotData;
}

// Hotspot3D: a clickable resource that is inside a 360 photosphere (pitch, yaw)
export interface Hotspot3D {
  pitch: number;
  yaw: number;
  id: string;
  tooltip: string;
  data: HotspotData;
}

// HotspotData: types of media resources for a hotspot within a photosphere
export type HotspotData =
  | Image
  | Audio
  | Video
  | Doc
  | URL
  | Message
  | PhotosphereLink;

// media objects
export interface Image {
  tag: "Image";
  src: Asset;
  width: number;
  height: number;
  hotspots: Record<string, Hotspot2D>;
}

export interface Video {
  readonly tag: "Video";
  src: Asset;
}

export interface Audio {
  tag: "Audio";
  src: Asset;
}

export interface Doc {
  tag: "Doc";
  src: Asset;
}

export interface URL {
  tag: "URL";
  url: string;
}

export interface Message {
  tag: "Message";
  content: string;
}

export interface PhotosphereLink {
  tag: "PhotosphereLink";
  photosphereID: string;
}
