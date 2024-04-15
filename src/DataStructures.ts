/* -----------------------------------------------------------------------
                    Virtual Field Environment Software
   -----------------------------------------------------------------------
    Instantiation of the objects that will be used for interacting with
    Photo Sphere Viewer to build a virtual geology field guide.
    Order listed from big-picture environment collection
    to micro-environments and associated elements.
   ----------------------------------------------------------------------- */

// Virtual Field Environment: the total collection of photosphere environments
export interface VFE {
  name: string;
  map: NavMap;
  defaultPhotosphereID: string;
  photospheres: Record<string, Photosphere>;
}

// Navigation map: a birdseye view of the various hotspots within a single 360-environment
export interface NavMap {
  src: string;
  rotation: number;
  defaultZoom: number;
  hotspots: Hotspot2D[];
}

// Photosphere: a single 360-environment
export interface Photosphere {
  id: string;
  src: string;
  hotspots: Record<string, Hotspot3D>;
  center: { x: number; y: number };
  backgroundAudio?: string;
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
  tooltip: string;
  data: HotspotData;
}

// HotspotData: types of media resources for a hotspot within a photosphere
export type HotspotData = Image | Audio | Video | URL | Doc | PhotosphereLink;

// media objects
export interface Image {
  tag: "Image";
  src: string;
  hotspots: Hotspot2D[];
}

export interface Video {
  readonly tag: "Video";
  src: string;
}

export interface Audio {
  tag: "Audio";
  src: string;
}

export interface URL {
  tag: "URL";
  src: string;
}

export interface Doc {
  tag: "Doc";
  content: string;
}

export interface PhotosphereLink {
  tag: "PhotosphereLink";
  photosphereID: string;
}
