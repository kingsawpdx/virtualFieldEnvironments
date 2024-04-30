import { Alert, Stack } from "@mui/material";
import { useParams } from "react-router-dom";

import { VFE } from "./DataStructures";
import PhotosphereViewer from "./PhotosphereViewer";

function PhotosphereLoader() {
  const { vfeID, photosphereID } = useParams() as {
    vfeID: string;
    photosphereID?: string;
  };

  const vfeData = window.localStorage.getItem(vfeID);

  if (!vfeData) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <Alert variant="filled" severity="error">
          Failed to load stored VFE data.
        </Alert>
      </Stack>
    );
  }

  const data = JSON.parse(vfeData) as VFE;
  return (
    <PhotosphereViewer
      vfe={data}
      currentPS={photosphereID}
      onChangePS={(id) => {
        history.replaceState(null, "", id); // change path without forcing a rerender
      }}
    />
  );
}

export default PhotosphereLoader;
