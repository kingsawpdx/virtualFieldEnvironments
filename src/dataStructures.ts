/* -----------------------------------------------------------------------
                    Virtual Field Environment Software
   -----------------------------------------------------------------------
    Instantiation of the objects that will be used for interacting with 
    Photo Sphere Viewer to build a virtual geology field guide. 
    Order listed from big-picture environment collection 
    to micro-environments and associated elements.
   ----------------------------------------------------------------------- */

// Virtual Field Environment: the total collection of photo sphere environments
export interface VFE {
  src: string;
  hotspot: hotspot3d[];
}

// Navigation map: a birdseye view of the various hotspots within a single 360-environment
export interface navMap {
  name: string;
  map: Map<string, number>; // arguments <"imgURL", center_number>
  photospere: photosphere[];
}

// Photosphere: a single 360-environment
export interface photosphere {
  id: string;
  src: string;
  hotspot: hotspot3d[];
  backgroundAudio: string;
}

// hotspot: a clickable resource that is 2d (x, y)
export interface hotspot2d {
  x: number;
  y: number;
  toolTip: string;
  hotspot: hotspot2d;
}

// hotspot: a clickable resource that is a 360 image (pitch, yaw)
export interface hotspot3d {
  pitch: number;
  yaw: number;
  toolTip: string;
  hotspot: hotspot3d;
}

// hotSpotData: types of media resources for a hotspot within a photosphere
export type hotspotData = img | audio | video | URL | doc | photosphereLink;

// media objects
export interface img {
  tag: "img";
  src: string;
  hotspot: hotspot2d[];
}

export interface video {
  readonly tag: "video";
  src: string;
}

export interface audio {
  tag: "audio";
  src: string;
}

export interface URL {
  tag: "URL";
  src: string;
}

export interface doc {
  tag: "doc";
  content: string;
}

export interface photosphereLink {
  tag: "photosphereLink";
  photosphereId: string;
}
