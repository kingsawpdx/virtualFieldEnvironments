import { Skeleton, Typography } from "@mui/material";
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
import { convertLocalToNetwork } from "./VFEConversion";

type NavMapRecord = Partial<Record<string, string>>;

function VFEList() {
  const [names, setNames] = useState<string[]>([]);
  const [navMaps, setNavMaps] = useState<NavMapRecord>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const keys = await localforage.keys();
      setNames(keys);

      const newNavMaps: NavMapRecord = {};
      for (const key of keys) {
        const localVFE = await localforage.getItem<VFE>(key);
        if (localVFE?.map) {
          const networkMap = await convertLocalToNetwork(localVFE.map.src);
          newNavMaps[key] = networkMap.path;
        }
      }
      setNavMaps(newNavMaps);
    }

    void load();
  }, []);

  return (
    <Stack direction="row" alignItems="center" gap={3}>
      {names.map((name) => (
        <Card key={name} sx={{ maxWidth: 345 }}>
          <CardHeader
            title={<Typography variant="h6">{name}</Typography>}
            disableTypography
          />

          {navMaps[name] ? (
            <CardMedia sx={{ height: 140 }} image={navMaps[name]} />
          ) : (
            <Skeleton height={140} variant="rectangular" />
          )}

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
