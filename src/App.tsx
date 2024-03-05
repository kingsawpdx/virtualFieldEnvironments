import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import VFEViewer from "./VFEViewer.tsx";
import Contact from "./assets/VFEdata/Contact.png";
import SampleScene from "./assets/VFEdata/ERI_Scene6-IMG_20231006_081813_00_122.jpg";
import SouthwaterFront from "./assets/VFEdata/SouthwaterFront.png";
import CloserLook from "./assets/VFEdata/a-closer-look.jpg";
import CoolLog from "./assets/VFEdata/cool_log.jpeg";
import Flowers from "./assets/VFEdata/flowers.png";
import HandSample from "./assets/VFEdata/hand_sample.png";
import LogNearShoreline from "./assets/VFEdata/logNEARshoreline.png";
import mapImage from "./assets/VFEdata/map.jpg";
import Mushroom from "./assets/VFEdata/mushroom.png";
import OutcropWide from "./assets/VFEdata/outcropWideView.png";
import OutcropTextures from "./assets/VFEdata/outcrop_textures.mp4";
import Paddlers from "./assets/VFEdata/paddlers.mp4";
import ShorelineSOUTH from "./assets/VFEdata/shorelineSOUTH.mp4";
import SmallPool from "./assets/VFEdata/small_pool.jpg";
import SEMComp from "./assets/VFEdata/southSEMcomp.png";

function App() {
  const hotspotArray: Hotspot3D[] = [
    {
      pitch: 5,
      yaw: -5,
      tooltip: "OutcropWideView",
      data: {
        tag: "Image",
        src: OutcropWide,
        hotspots: [],
      },
    },
    {
      pitch: -3,
      yaw: 18,
      tooltip: "Flowers",
      data: {
        tag: "Image",
        src: Flowers,
        hotspots: [],
      },
    },
    {
      pitch: -32,
      yaw: 172,
      tooltip: "ShorelineSOUTH.mp4",
      data: {
        tag: "Video",
        src: ShorelineSOUTH,
      },
    },
    {
      pitch: -10,
      yaw: -175,
      tooltip: "Paddlers.mp4",
      data: {
        tag: "Video",
        src: Paddlers,
      },
    },
    {
      pitch: -13,
      yaw: 100,
      tooltip: "SmallPool",
      data: {
        tag: "Image",
        src: SmallPool,
        hotspots: [],
      },
    },
    {
      pitch: -25,
      yaw: -40,
      tooltip: "LogNearShoreline",
      data: {
        tag: "Image",
        src: LogNearShoreline,
        hotspots: [],
      },
    },
    {
      pitch: -17,
      yaw: -33,
      tooltip: "CoolLog",
      data: {
        tag: "Image",
        src: CoolLog,
        hotspots: [],
      },
    },
    {
      pitch: 0,
      yaw: -44,
      tooltip: "HandSample",
      data: {
        tag: "Image",
        src: HandSample,
        hotspots: [],
      },
    },
    {
      pitch: 6,
      yaw: 5,
      tooltip: "OutcropTextures",
      data: {
        tag: "Video",
        src: OutcropTextures,
      },
    },
    {
      pitch: -12,
      yaw: -37,
      tooltip: "How did these huge logs get here?",
      data: {
        tag: "Doc",
        content: "How did these huge logs get here?",
      },
    },
    {
      pitch: 2,
      yaw: -19,
      tooltip: "Mushroom",
      data: {
        tag: "Image",
        src: Mushroom,
        hotspots: [],
      },
    },
    {
      pitch: -2,
      yaw: -46,
      tooltip: "CloserLook",
      data: {
        tag: "Image",
        src: CloserLook,
        hotspots: [],
      },
    },
    {
      pitch: 0,
      yaw: -48,
      tooltip: "SouthSEMComparison",
      data: {
        tag: "Image",
        src: SEMComp,
        hotspots: [],
      },
    },
    {
      pitch: 2,
      yaw: -46,
      tooltip: "Contact",
      data: {
        tag: "Image",
        src: Contact,
        hotspots: [],
      },
    },
    {
      pitch: -1,
      yaw: -25,
      tooltip: "SouthWaterfront",
      data: {
        tag: "Image",
        src: SouthwaterFront,
        hotspots: [],
      },
    },
  ];

  const prototype: Photosphere = {
    id: "prototypeSphere",
    src: SampleScene,
    hotspots: hotspotArray,
    backgroundAudio: "",
  };

  const alternative: Photosphere = {
    id: "alternativeSphere",
    src: OutcropWide, // TODO: replace with an actual panoramic image that is different from sampleScene
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
