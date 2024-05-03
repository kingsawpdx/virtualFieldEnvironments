import { Alert, Stack } from "@mui/material";
import localforage from "localforage";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { VFE } from "./DataStructures";
import { convertLocalToNetwork, convertVFE } from "./VFEConversion";

export interface ElementProps {
  vfe: VFE;
  onUpdateVFE: (updatedVFE: VFE) => void;
  currentPS: string;
  onChangePS: (id: string) => void;
}

export interface PhotosphereLoaderProps {
  render: (props: ElementProps) => ReactElement;
}

function VFELoader({ render }: PhotosphereLoaderProps) {
  const navigate = useNavigate();
  const { vfeID } = useParams() as {
    vfeID: string;
    photosphereID?: string;
  };
  const [vfe, setVFE] = useState<VFE | null>();

  useEffect(() => {
    async function load() {
      const vfe = await localforage.getItem<VFE>(vfeID);
      if (vfe) {
        const networkVFE = await convertVFE(vfe, convertLocalToNetwork);
        setVFE(networkVFE);
      }
    }

    void load();
  }, [vfeID]);

  if (!vfe) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <Alert variant="filled" severity="info">
          Loading VFE data.
        </Alert>
      </Stack>
    );
  }

  return render({
    vfe,
    onUpdateVFE: (updatedVFE) => {
      setVFE(updatedVFE);
    },
    currentPS: vfe.defaultPhotosphereID,
    onChangePS: (id) => {
      navigate(id, { replace: true });
      history.replaceState(null, "", id);
    },
  });
}

export default VFELoader;
