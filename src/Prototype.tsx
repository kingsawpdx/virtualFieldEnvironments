import { Alert, Stack } from "@mui/material";

import { VFE } from "./DataStructures.ts";
import PhotosphereViewer from "./PhotosphereViewer.tsx";
import dataArray from "./data.json";

function App() {
  window.localStorage.setItem("vfeData", JSON.stringify(dataArray));
  const vfeData = window.localStorage.getItem("vfeData");

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
  return <PhotosphereViewer vfe={data} />;
}

export default App;
