import {
  Hotspot2D,
  Hotspot3D,
  HotspotData,
  NavMap,
  Photosphere,
  VFE,
} from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import EastScene from "./assets/VFEdata/ERI_East-Scene9-IMG_20231006_092207_00_125.jpg";
import EntranceScene from "./assets/VFEdata/ERI_Entrance-Scene0-IMG_20231006_080232_00_120.jpg";
import NorthScene from "./assets/VFEdata/ERI_North-Scene8-IMG_20231006_091050_00_124.jpg";
import SouthScene from "./assets/VFEdata/ERI_SouthScene_6-IMG_20231006_081813_00_122.jpg";
import WestScene from "./assets/VFEdata/ERI_West-Scene7-IMG_20231006_084114_00_123.jpg";
import audioFile from "./assets/VFEdata/Scene12_UnevenStandTop_LS100146.mp3";
import mapImage from "./assets/VFEdata/map.jpg";
import dataArray from "./data.json";

function App() {
  function hotspotArrayExtract(
    hotspotArray: Record<string, Hotspot2D>,
  ): Record<string, Hotspot2D> {
    const keys = Object.keys(hotspotArray);
    const firstKey = keys[0];

    const returnString = hotspotArray[firstKey].tooltip;

    const returnObject: Record<string, Hotspot2D> = {};

    returnObject[returnString] = {
      x: Number(hotspotArray[firstKey].x),
      y: Number(hotspotArray[firstKey].y),
      id: hotspotArray[firstKey].id,
      tooltip: hotspotArray[firstKey].tooltip,
      color: hotspotArray[firstKey].color,
      data: hotspotDataEvaluation(hotspotArray[firstKey].data),
    };

    return returnObject;
  }

  function hotspotDataEvaluation(hotspot: HotspotData): HotspotData {
    switch (hotspot.tag) {
      case "Image":
        let hotspotArray: Record<string, Hotspot2D> = {};

        if (hotspot.hotspots) {
          hotspotArray = hotspotArrayExtract(hotspot.hotspots);
        } else {
          hotspotArray = {};
        }

        return {
          tag: "Image",
          src: hotspot.src,
          hotspots: hotspotArray,
        };
        break;
      case "Video":
      case "URL":
      case "Audio":
        return {
          tag: hotspot.tag,
          src: hotspot.src,
        };
        break;
      case "Doc":
        return {
          tag: hotspot.tag,
          content: "",
        };
        break;
      case "PhotosphereLink":
        return {
          tag: hotspot.tag,
          photosphereID: hotspot.photosphereID,
        };
        break;
    }
  }

  const southHotspotArray: Hotspot3D[] = Object.values(
    dataArray.vfeData.photospheres.south.hotspots,
  ).map((hotspot) => {
    return {
      pitch: Number(hotspot.pitch),
      yaw: Number(hotspot.yaw),
      tooltip: hotspot.tooltip,
      data: hotspotDataEvaluation(hotspot.data),
    };
  });

  const south: Photosphere = {
    id: "South",
    src: SouthScene,
    center: { x: 450, y: 800 },
    hotspots: Object.fromEntries(
      southHotspotArray.map((hotspot) => [hotspot.tooltip, hotspot]),
    ),
    backgroundAudio: audioFile,
  };

  const west: Photosphere = {
    id: "West",
    src: WestScene,
    center: { x: 95, y: 530 },
    hotspots: {
      "Go North": {
        pitch: 0,
        yaw: 10,
        tooltip: "Go North",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "North",
        },
      },
      "Go South": {
        pitch: -3,
        yaw: 115,
        tooltip: "Go South",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "South",
        },
      },
    },
  };

  const north: Photosphere = {
    id: "North",
    src: NorthScene,
    center: { x: 390, y: 50 },
    hotspots: {
      "Go West": {
        pitch: 0,
        yaw: -130,
        tooltip: "Go West",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "West",
        },
      },
      "Go East": {
        pitch: 0,
        yaw: 92,
        tooltip: "Go East",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "East",
        },
      },
    },
  };

  const east: Photosphere = {
    id: "East",
    src: EastScene,
    center: { x: 550, y: 450 },
    hotspots: {
      "Go North": {
        pitch: 3,
        yaw: 2,
        tooltip: "Go North",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "North",
        },
      },
      "Go to Entrance": {
        pitch: -2,
        yaw: -167,
        tooltip: "Go to Entrance",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "Entrance",
        },
      },
    },
  };

  const entrance: Photosphere = {
    id: "Entrance",
    src: EntranceScene,
    center: { x: 650, y: 930 },
    hotspots: {
      "Go East": {
        pitch: -2,
        yaw: -4,
        tooltip: "Go East",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "East",
        },
      },
      "Go South": {
        pitch: -4,
        yaw: -78,
        tooltip: "Go South",
        data: {
          tag: "PhotosphereLink",
          photosphereID: "South",
        },
      },
    },
  };

  const photospheres: Record<string, Photosphere> = Object.values(
    dataArray.vfeData.photospheres,
  ).reduce((key, photosphere) => {
    // let photosphereEntry: Record<string, Photosphere> = {}

    //Create a Hotspot3D[] for each photosphere
    const photosphereHotspotArray: Hotspot3D[] = Object.values(
      photosphere.hotspots,
    ).map((hotspot) => {
      return {
        pitch: Number(hotspot.pitch),
        yaw: Number(hotspot.yaw),
        tooltip: hotspot.tooltip,
        data: hotspotDataEvaluation(hotspot.data),
      };
    });

    key[photosphere.id] = {
      id: photosphere.id,
      src: photosphere.src,
      center: {
        x: photosphere.center.x,
        y: photosphere.center.y,
      },

      hotspots: Object.fromEntries(
        photosphereHotspotArray.map((hotspot) => [hotspot.tooltip, hotspot]),
      ),
    };
    return key;
  }, {});

  console.log("New photospheres");
  console.log(photospheres);

  const oldPhotospheres: Record<string, Photosphere> = {
    [entrance.id]: entrance,
    [south.id]: south,
    [west.id]: west,
    [north.id]: north,
    [east.id]: east,
  };
  console.log("Old photospheres");
  console.log(oldPhotospheres);

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
