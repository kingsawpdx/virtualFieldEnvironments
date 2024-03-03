import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import VFEViewer from "./VFEViewer.tsx";
import sampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import flowers from "./assets/VFEdata/flowers.png";
import mapImage from "./assets/VFEdata/map.jpg";
import outcropWide from "./assets/VFEdata/outcropWideView.png";

function App() {
  const hotspotArray: Hotspot3D[] = [
    {
      pitch: 5,
      yaw: -5,
      tooltip: "Outcrop wideview",
      data: {
        tag: "Image",
        src: outcropWide,
        hotspots: [],
      },
    },
    {
      pitch: -3,
      yaw: 18,
      tooltip: "Flowers",
      data: {
        tag: "Image",
        src: flowers,
        hotspots: [],
      },
    },
  ];

  const prototype: Photosphere = {
    id: "prototypeSphere",
    src: sampleScene,
    hotspots: hotspotArray,
    backgroundAudio: "",
  };

  const alternative: Photosphere = {
    id: "alternativeSphere",
    src: outcropWide, // TODO: replace with an actual panoramic image that is different from sampleScene
    hotspots: [],
    backgroundAudio: "",
  };

  const map: NavMap = {
    src: mapImage,
    center: { x: 450, y: 800 },
    rotation: "0deg",
    defaultZoom: 20,
    hotspots: [
      {
        x: 95,
        y: 530,
        id: "West",
        color: "yellow",
        tooltip: "West",
        data: { tag: "PhotosphereLink", photosphereID: alternative.id },
      },
    ],
  };

  const data: VFE = {
    name: "prototypeElkIslandVFE",
    map: map,
    photospheres: [prototype, alternative],
  };

  return <VFEViewer vfe={data} />;
}

export default App;
