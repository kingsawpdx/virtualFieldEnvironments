import { useState } from "react";

import PhotoSphereViewer from "./PhotoSphereViewer";
import PhotoSphereSelector from "./PhotosphereSelector";
import { Photosphere, VFE } from "./dataStructures";

export interface VFEViewerProps {
  vfe: VFE;
}

function VFEViewer({ vfe }: VFEViewerProps) {
  const photoSphereMap: Record<string, Photosphere> = Object.fromEntries(
    vfe.photospere.map((p) => [p.id, p]),
  );

  const [currentPhotoSphereID, setCurrentPhotoSphereID] = useState<
    string | undefined
  >(vfe.photospere[0]?.id);

  return (
    <>
      <PhotoSphereSelector
        options={vfe.photospere.map((p) => p.id)}
        value={currentPhotoSphereID}
        setValue={setCurrentPhotoSphereID}
      />
      {currentPhotoSphereID !== undefined ? (
        <PhotoSphereViewer
          photosphere={photoSphereMap[currentPhotoSphereID]}
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
