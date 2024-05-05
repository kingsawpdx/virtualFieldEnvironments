import { CardContent } from "@mui/material";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { VFE } from "./DataStructures";

function VFEList() {
  const [names, setNames] = useState<string[]>([]);
  const [navMap, setNavMap] = useState<Record<string, string | undefined>>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setNames(await localforage.keys());
      const newNavMap: Record<string, string | undefined> = {};
      await localforage.iterate(function (value: VFE, key) {
        if (value.map) {
          newNavMap[key] = value.map.src.path;
        }
      });
      setNavMap(newNavMap);
    }

    void load();
  }, []);

  return (
    <Stack direction="row" alignItems="center" gap={3}>
      {names.map((name) => (
        <Card key={name} sx={{ maxWidth: 345 }}>
          <CardHeader title={name}> </CardHeader>
          <CardMedia sx={{ height: 140 }} image={navMap[name]}></CardMedia>
          <CardContent></CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                navigate(`/viewer/${name}/`);
              }}
            >
              Viewer
            </Button>
            <Button
              size="small"
              onClick={() => {
                navigate(`/editor/${name}/`);
              }}
            >
              Editor
            </Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}

export default VFEList;
