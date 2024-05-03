import localforage from "localforage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import vfeData from "./data.json";

function Prototype() {
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      await localforage.setItem("prototype", vfeData);
      navigate("/viewer/prototype/", { replace: true });
    }

    void load();
  }, [navigate]);

  return <></>;
}

export default Prototype;
