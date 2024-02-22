/* -----------------------------------------------------------------------
                    Virtual Field Environment Software
   -----------------------------------------------------------------------
    Instantiation of the objects that will be used for interacting with 
    Photo Sphere Viewer to build a virtual geology field guide.
   ----------------------------------------------------------------------- */

// Virtual Field Environment: the total collection of photo sphere environments
export interface VFE {
  name: string;
  map: Map<string, number>; // arguments <"imgURL", center_number>
  photospere: photosphere[];
}

// Navigation map: a birdseye view of the various hotspots within a single 360-environment
export interface navMap {
  src: string;
  hotspot: hotspot[];
}

// Photosphere: a single 360-environment
export interface photosphere {
  id: string;
  src: string;
  hotspot: hotspot[];
  backgroundAudio: string;
}

// hotspot: can be a 2d-image (x,y) or 3d-image (pitch, yaw)
export type hotspot = img2d | img3d;

// hotSpotData: types of media resources for a hotspot within a photosphere
export type hotspotData = img | audio | video | URL | doc | photosphereLink;

// media objects
export interface img {
  tag: "img";
  src: string;
  hotspot: hotspot[]; // can be 2d|3d
}

export interface img2d {
  x: number;
  y: number;
  toolTip: string;
}

export interface img3d {
  pitch: number;
  yaw: number;
  toolTip: string;
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
