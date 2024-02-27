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
  photospere: Photosphere[];
}

// Navigation map: a birdseye view of the various hotspots within a single 360-environment
export interface NavMap {
  src: string;
  hotspot: HotSpot3d[];
}

// Photosphere: a single 360-environment
export interface Photosphere {
  id: string;
  src: string;
  hotspot: HotSpot3d[];
  backgroundAudio: string;
}

// hotspot: a clickable resource that is 2d (x, y)
export interface HotSpot2d {
  x: number;
  y: number;
  toolTip: string;
  data: HotSpotData;
}

// hotspot: a clickable resource that is a 360 image (pitch, yaw)
export interface HotSpot3d {
  pitch: number;
  yaw: number;
  toolTip: string;
  data: HotSpotData;
}

// hotSpotData: types of media resources for a hotspot within a photosphere
export type HotSpotData = Image | Audio | Video | URL | Doc | PhotosphereLink;

// media objects
export interface Image {
  tag: "Image";
  src: string;
  hotspot: HotSpot2d[];
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
  photosphereId: string;
}
