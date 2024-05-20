import {
  FormControlLabel,
  Stack,
  Switch,
  SwitchProps,
  styled,
} from "@mui/material";
import { Point, Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MapHotspot } from "@photo-sphere-viewer/map-plugin";
import { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import {
  VirtualTourLink,
  VirtualTourNode,
} from "@photo-sphere-viewer/virtual-tour-plugin";
import React, { useEffect, useRef, useState } from "react";
import {
  MapPlugin,
  MapPluginConfig,
  MarkersPlugin,
  ReactPhotoSphereViewer,
  ViewerAPI,
  VirtualTourPlugin,
  VirtualTourPluginConfig,
} from "react-photo-sphere-viewer";

import AudioToggleButton from "./AudioToggleButton";
import {
  Hotspot2D,
  Hotspot3D,
  HotspotData,
  NavMap,
  Photosphere,
  VFE,
} from "./DataStructures";
import PhotosphereSelector from "./PhotosphereSelector";
import PopOver from "./PopOver";

// modified from https://mui.com/material-ui/react-switch/#customization 'iOS style'
const StyledSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
  },
}));

/** Convert yaw/pitch degrees from numbers to strings ending in "deg" */
function degToStr(val: number): string {
  return String(val) + "deg";
}

/** Convert sizes from numbers to strings ending in "px" */
function sizeToStr(val: number): string {
  return String(val) + "px";
}

/** Convert non-link hotspots to markers with type-based content/icons */
function convertHotspots(hotspots: Record<string, Hotspot3D>): MarkerConfig[] {
  const markers: MarkerConfig[] = [];

  for (const hotspot of Object.values(hotspots)) {
    if (hotspot.data.tag === "PhotosphereLink") continue;

    let icon =
      "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-blue.png"; // default

    switch (hotspot.data.tag) {
      case "Image":
        break;
      case "Video":
        icon =
          "https://photo-sphere-viewer-data.netlify.app/assets/pictos/pin-red.png"; // changed to make linter happy until icons are ready
        break;
      case "Audio":
        break;
      case "Doc":
        break;
      case "URL":
        break;
      default:
        break;
    }

    markers.push({
      id: hotspot.tooltip,
      image: icon,
      size: { width: 64, height: 64 },
      position: {
        yaw: degToStr(hotspot.yaw),
        pitch: degToStr(hotspot.pitch),
      },
      tooltip: hotspot.tooltip,
    });
  }

  return markers;
}

interface LinkData {
  tooltip: string;
}

/** Convert photosphere-link hotspots to virtual tour links  */
function convertLinks(hotspots: Record<string, Hotspot3D>): VirtualTourLink[] {
  const links: VirtualTourLink[] = [];

  for (const hotspot of Object.values(hotspots)) {
    if (hotspot.data.tag !== "PhotosphereLink") continue;

    links.push({
      nodeId: hotspot.data.photosphereID,
      position: {
        pitch: degToStr(hotspot.pitch),
        yaw: degToStr(hotspot.yaw),
      },
      data: { tooltip: hotspot.tooltip } as LinkData,
    });
  }

  return links;
}

function convertMap(
  map: NavMap,
  photospheres: Record<string, Photosphere>,
  currentCenter?: Point,
  staticEnabled = false,
): MapPluginConfig {
  const hotspots: MapHotspot[] = [];

  for (const [id, photosphere] of Object.entries(photospheres)) {
    if (photosphere.center === undefined) continue;

    hotspots.push({
      id: id,
      tooltip: id,
      x: photosphere.center.x,
      y: photosphere.center.y,
      color: "yellow",
    });
  }

  return {
    imageUrl: map.src.path,
    center: currentCenter ?? map.defaultCenter,
    rotation: map.rotation,
    defaultZoom: map.defaultZoom,
    minZoom: 1,
    maxZoom: 100,
    size: sizeToStr(map.size),
    hotspots,
    static: staticEnabled,
  };
}

export interface PhotosphereViewerProps {
  vfe: VFE;
  currentPS: string;
  onChangePS: (id: string) => void;
  onViewerClick?: (pitch: number, yaw: number) => void;
  onUpdateHotspot?: (hotspotID: string, newData: HotspotData | null) => void;
}

function PhotosphereViewer({
  vfe,
  currentPS,
  onChangePS,
  onViewerClick,
  onUpdateHotspot,
}: PhotosphereViewerProps) {
  const photoSphereRef = React.createRef<ViewerAPI>();
  const [currentPhotosphere, setCurrentPhotosphere] =
    React.useState<Photosphere>(vfe.photospheres[currentPS]);
  const [hotspotArray, setHotspotArray] = useState<(Hotspot3D | Hotspot2D)[]>(
    [],
  );
  const [mapStatic, setMapStatic] = useState(false);

  // The variable is set to true after handleReady has finished
  const ready = useRef(false);
  const defaultPanorama = useRef(vfe.photospheres[currentPS].src.path);

  useEffect(() => {
    if (ready.current) {
      const virtualTour =
        photoSphereRef.current?.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
      void virtualTour?.setCurrentNode(currentPhotosphere.id);

      const map = photoSphereRef.current?.getPlugin<MapPlugin>(MapPlugin);
      if (currentPhotosphere.center) {
        map?.setCenter(currentPhotosphere.center);
      }
    }
  }, [currentPhotosphere, photoSphereRef]);

  const plugins: ViewerConfig["plugins"] = [
    [MarkersPlugin, {}],

    [
      VirtualTourPlugin,
      {
        renderMode: "markers",
        getLinkTooltip(_content: string, link: VirtualTourLink): string {
          return (link.data as LinkData).tooltip;
        },
      } as VirtualTourPluginConfig,
    ],

    // Only fill map plugin config when VFE has a map
    [
      MapPlugin,
      vfe.map
        ? convertMap(
            vfe.map,
            vfe.photospheres,
            currentPhotosphere.center ?? vfe.map.defaultCenter,
            mapStatic,
          )
        : {},
    ],
  ];

  function handleReady(instance: Viewer) {
    const markerTestPlugin: MarkersPlugin = instance.getPlugin(MarkersPlugin);

    markerTestPlugin.addEventListener("select-marker", ({ marker }) => {
      if (marker.config.id.includes("__tour-link")) return;

      // setCurrentPhotosphere has to be used to get the current state value because
      // the value of currentPhotosphere does not get updated in an event listener
      setCurrentPhotosphere((currentState) => {
        const passMarker = currentState.hotspots[marker.config.id];
        setHotspotArray([passMarker]);
        return currentState;
      });
    });

    instance.addEventListener("click", ({ data }) => {
      if (!data.rightclick) {
        onViewerClick?.(data.pitch, data.yaw);
      }
    });

    const virtualTour =
      instance.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);

    const nodes: VirtualTourNode[] = Object.values(vfe.photospheres).map(
      (p) => {
        return {
          id: p.id,
          panorama: p.src.path,
          name: p.id,
          markers: convertHotspots(p.hotspots),
          links: convertLinks(p.hotspots),
        };
      },
    );

    virtualTour.setNodes(nodes, currentPS);
    virtualTour.addEventListener("node-changed", ({ node }) => {
      setCurrentPhotosphere(vfe.photospheres[node.id]);
      onChangePS(node.id);
      setHotspotArray([]); // clear popovers on scene change
    });

    const map = instance.getPlugin<MapPlugin>(MapPlugin);
    map.addEventListener("select-hotspot", ({ hotspotId }) => {
      const photosphere = vfe.photospheres[hotspotId];
      setCurrentPhotosphere(photosphere);
      onChangePS(photosphere.id);
    });

    ready.current = true;
  }

  return (
    <>
      <Stack
        direction="row"
        sx={{
          position: "absolute",
          top: "16px",
          left: 0,
          right: 0,
          maxWidth: "420px",
          width: "fit-content",
          minWidth: "150px",
          height: "45px",
          padding: "4px",
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 0 4px grey",
          zIndex: 100,
          justifyContent: "space-between",
        }}
        spacing={1}
      >
        <PhotosphereSelector
          options={Object.keys(vfe.photospheres)}
          value={currentPhotosphere.id}
          setValue={(id) => {
            setCurrentPhotosphere(vfe.photospheres[id]);
            onChangePS(id);
          }}
        />
        {currentPhotosphere.backgroundAudio && (
          <AudioToggleButton src={currentPhotosphere.backgroundAudio.path} />
        )}
        <FormControlLabel
          control={
            <StyledSwitch
              defaultChecked
              onChange={() => {
                setMapStatic(!mapStatic);
              }}
            />
          }
          label="Map Rotation"
          componentsProps={{
            typography: {
              sx: { fontSize: "14px", padding: 1, width: "60px" },
            },
          }}
        />
      </Stack>

      {hotspotArray.length > 0 && (
        <PopOver
          hotspotData={hotspotArray[hotspotArray.length - 1].data}
          hotspotID={hotspotArray[hotspotArray.length - 1].tooltip}
          arrayLength={hotspotArray.length}
          pushHotspot={(add: Hotspot2D) => {
            setHotspotArray([...hotspotArray, add]);
          }}
          popHotspot={() => {
            setHotspotArray(hotspotArray.slice(0, -1));
          }}
          closeAll={() => {
            setHotspotArray([]);
          }}
          onUpdateHotspot={onUpdateHotspot}
        />
      )}

      <ReactPhotoSphereViewer
        key={mapStatic ? "static" : "dynamic"}
        onReady={handleReady}
        ref={photoSphereRef}
        src={defaultPanorama.current}
        plugins={plugins}
        height={"100vh"}
        width={"100%"}
        navbar={["autorotate", "zoom", "caption", "download", "fullscreen"]}
      />
    </>
  );
}

export default PhotosphereViewer;
