import {
  Hotspot2D,
  Hotspot3D,
  HotspotData,
  NavMap,
  Photosphere,
  VFE,
} from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import dataArray from "./data.json";

function App() {
  //It works with the imported data

  window.localStorage.setItem("vfeData", JSON.stringify(dataArray));

  //It does not work with VFEData as it has type any
  const VFEData = JSON.parse(window.localStorage.getItem("vfeData") || "{}");

  //If nested hotspots, the nested data is returned as a record.
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

  //Evaluates hotspot type and returns relevant fields.
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
  console.log(typeof VFEData.vfeData.photospheres);
  console.log(typeof dataArray.vfeData.photospheres);
  //Create a record of photospheres for each photosphere imported.
  const photospheres: Record<string, Photosphere> = Object.values(
    dataArray.vfeData.photospheres,
  ).reduce((key, photosphere) => {
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
        x: Number(photosphere.center.x),
        y: Number(photosphere.center.y),
      },
      hotspots: Object.fromEntries(
        photosphereHotspotArray.map((hotspot) => [hotspot.tooltip, hotspot]),
      ),
    };
    return key;
  }, {});

  const map: NavMap = {
    src: dataArray.vfeData.map.src,
    rotation: Number(dataArray.vfeData.map.rotation),
    defaultZoom: Number(dataArray.vfeData.map.defaultZoom),
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
    name: dataArray.name,
    map: map,
    defaultPhotosphereID: dataArray.defaultID,
    photospheres,
  };

  return <PhotosphereViewer vfe={data} />;
}

export default App;
