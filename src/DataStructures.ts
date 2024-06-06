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

export function photosphereLinkTooltip(photosphereID: string) {
  return `Go to ${photosphereID}`;
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

export interface StoredAsset {
  tag: "Stored";
  id: string;
  path: string;
}

export interface RuntimeAsset {
  tag: "Runtime";
  id: string;
  path: string;
}

export type Asset = StoredAsset | RuntimeAsset;

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
  width: number;
  height: number;
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
  id: string;
  tooltip: string;
  x: number;
  y: number;
  color: string;
  data: HotspotData;
}

// Hotspot3D: a clickable resource that is inside a 360 photosphere (pitch, yaw)
export interface Hotspot3D {
  id: string;
  tooltip: string;
  pitch: number;
  yaw: number;
  level: number;
  icon: Asset;
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
  | PhotosphereLink
  | Quiz;

// media objects
export interface Image {
  tag: "Image";
  width: number;
  height: number;
  src: Asset;
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

export interface Quiz {
  tag: "Quiz";
  question: string;
  answer: string;
}
