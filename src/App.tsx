import { Hotspot3D, NavMap, Photosphere, VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import Contact from "./assets/VFEdata/Contact.png";
import EastScene from "./assets/VFEdata/ERI_East-Scene9-IMG_20231006_092207_00_125.jpg";
import EntranceScene from "./assets/VFEdata/ERI_Entrance-Scene0-IMG_20231006_080232_00_120.jpg";
import NorthScene from "./assets/VFEdata/ERI_North-Scene8-IMG_20231006_091050_00_124.jpg";
import SouthScene from "./assets/VFEdata/ERI_SouthScene_6-IMG_20231006_081813_00_122.jpg";
import WestScene from "./assets/VFEdata/ERI_West-Scene7-IMG_20231006_084114_00_123.jpg";
import audioFile from "./assets/VFEdata/Scene12_UnevenStandTop_LS100146.mp3";
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
    {
      pitch: 0,
      yaw: -35,
      tooltip: "Go West",
      data: {
        tag: "PhotosphereLink",
        photosphereID: "West",
      },
    },
    {
      pitch: -7,
      yaw: 125,
      tooltip: "Go to Entrance",
      data: {
        tag: "PhotosphereLink",
        photosphereID: "Entrance",
      },
    },
  ];

  const south: Photosphere = {
    id: "South",
    src: SouthScene,
    center: { x: 450, y: 800 },
    hotspots: hotspotArray,
    backgroundAudio: audioFile,
  };

  const west: Photosphere = {
    id: "West",
    src: WestScene,
    center: { x: 95, y: 530 },
    hotspots: [
      {
        pitch: 0,
        yaw: 10,
        tooltip: "Go North",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "North",
        },
      },
      {
        pitch: -3,
        yaw: 115,
        tooltip: "Go South",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "South",
        },
      },
    ],
  };

  const north: Photosphere = {
    id: "North",
    src: NorthScene,
    center: { x: 390, y: 50 },
    hotspots: [
      {
        pitch: 0,
        yaw: -130,
        tooltip: "Go West",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "West",
        },
      },
      {
        pitch: 0,
        yaw: 92,
        tooltip: "Go East",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "East",
        },
      },
    ],
  };

  const east: Photosphere = {
    id: "East",
    src: EastScene,
    center: { x: 550, y: 450 },
    hotspots: [
      {
        pitch: 3,
        yaw: 2,
        tooltip: "Go North",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "North",
        },
      },
      {
        pitch: -2,
        yaw: -167,
        tooltip: "Go to Entrance",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "Entrance",
        },
      },
    ],
  };

  const entrance: Photosphere = {
    id: "Entrance",
    src: EntranceScene,
    center: { x: 650, y: 930 },
    hotspots: [
      {
        pitch: -2,
        yaw: -4,
        tooltip: "Go East",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "East",
        },
      },
      {
        pitch: -4,
        yaw: -78,
        tooltip: "Go South",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "South",
        },
      },
    ],
  };

  const photospheres: Record<string, Photosphere> = {
    [entrance.id]: entrance,
    [south.id]: south,
    [west.id]: west,
    [north.id]: north,
    [east.id]: east,
  };

  const map: NavMap = {
    src: mapImage,
    rotation: 0,
    defaultZoom: 20,
    hotspots: Object.values(photospheres).map((p) => {
      return {
        x: p.center.x,
        y: p.center.y,
        id: p.id,
        color: "yellow",
        tooltip: p.id,
        data: { tag: "PhotosphereLink", photosphereID: p.id },
      };
    }),
  };

  const data: VFE = {
    name: "prototypeElkIslandVFE",
    map: map,
    defaultPhotosphereID: south.id,
    photospheres,
  };

  return <PhotosphereViewer vfe={data} />;
}

export default App;
