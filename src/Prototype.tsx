import localforage from "localforage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { VFE } from "./DataStructures";
import vfeData from "./data.json";

function Prototype() {
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const vfe = vfeData as VFE;
      await localforage.setItem(vfe.name, vfe);
      navigate(`/viewer/${vfe.name}/${vfe.defaultPhotosphereID}`, {
        replace: true,
      });
    }

    void load();
  }, [navigate]);

  return <></>;
}

export default Prototype;
