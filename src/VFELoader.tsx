import { Alert, Stack } from "@mui/material";
import localforage from "localforage";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { VFE } from "./DataStructures";
//import { useVisitedState } from "./HandleVisit";
import {
  convertLocalToNetwork,
  convertNetworkToLocal,
  convertVFE,
} from "./VFEConversion";

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
  const { vfeID, photosphereID } = useParams() as {
    vfeID: string;
    photosphereID?: string;
  };
  const [vfe, setVFE] = useState<VFE | null>();

 // const [, , reset] = useVisitedState({});

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

  async function saveVFE(networkVFE: VFE) {
    const localVFE = await convertVFE(networkVFE, convertNetworkToLocal);
    await localforage.setItem(localVFE.name, localVFE);
   // reset();
  }

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
      void saveVFE(updatedVFE);
    },
    currentPS: photosphereID ?? vfe.defaultPhotosphereID,
    onChangePS: (id) => {
      if (id !== photosphereID) {
        navigate(id, { replace: true });
      }
    },
  });
}

export default VFELoader;
