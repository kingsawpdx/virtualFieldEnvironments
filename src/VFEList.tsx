import localforage from "localforage";
import { useEffect, useState } from "react";

function VFEList() {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      setNames(await localforage.keys());
    }

    void load();
  }, []);

  return names.map((name) => <p key={name}>{name}</p>);
}

export default VFEList;
