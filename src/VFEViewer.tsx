import { useState } from "react";

import { Photosphere, VFE } from "./DataStructures";
import PhotosphereSelector from "./PhotosphereSelector";
import PhotosphereViewer from "./PhotosphereViewer";

export interface VFEViewerProps {
  vfe: VFE;
}

function VFEViewer({ vfe }: VFEViewerProps) {
  const photosphereMap: Record<string, Photosphere> = Object.fromEntries(
    vfe.photospheres.map((p) => [p.id, p]),
  );

  const [currentPhotosphereID, setCurrentPhotosphereID] = useState<
    string | undefined
  >(vfe.photospheres[0]?.id);

  return (
    <>
      <PhotosphereSelector
        options={vfe.photospheres.map((p) => p.id)}
        value={currentPhotosphereID}
        setValue={setCurrentPhotosphereID}
      />
      {currentPhotosphereID !== undefined ? (
        <PhotosphereViewer
          photosphere={photosphereMap[currentPhotosphereID]}
          map={vfe.map}
        />
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No photosphere selected
        </div>
      )}
    </>
  );
}

export default VFEViewer;
