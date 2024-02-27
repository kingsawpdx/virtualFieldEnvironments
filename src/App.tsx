import PhotoSphereViewer from "./PhotoSphereViewer.tsx";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import flowers from "./assets/VFEdata/flowers.png";
import outcropWide from "./assets/VFEdata/outcropWideView.png";
import { HotSpot3d, NavMap, Photosphere, VFE } from "./dataStructures.ts";

function App() {
  const hotspotArray: HotSpot3d[] = [
    {
      pitch: 5,
      yaw: -5,
      toolTip: "Outcrop wideview",
      data: {
        tag: "Image",
        src: outcropWide,
        hotspot: [],
      },
    },
    {
      pitch: -3,
      yaw: 18,
      toolTip: "Flowers",
      data: {
        tag: "Image",
        src: flowers,
        hotspot: [],
      },
    },
  ];

  const prototype: Photosphere = {
    id: "prototypeSphere",
    src: sampleScene,
    hotspot: hotspotArray,
    backgroundAudio: "",
  };

  const map: NavMap = {
    src: "map src",
    hotspot: [],
  };

  const data: VFE = {
    name: "prototypeElkIslandVFE",
    map: map,
    photospere: [prototype],
  };

  return <PhotoSphereViewer {...data} />;
}

export default App;
