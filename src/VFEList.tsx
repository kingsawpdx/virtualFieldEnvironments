import {
  Dialog,
  DialogActions,
  DialogTitle,
  Skeleton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { VFE } from "./DataStructures";
import { convertLocalToNetwork } from "./VFEConversion";

type NavMapRecord = Partial<Record<string, string>>;

function VFEList() {
  const [names, setNames] = useState<string[]>([]);
  const [navMaps, setNavMaps] = useState<NavMapRecord>({});
  const [toDelete, setToDelete] = useState<string | null>(null);

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

  function dismissDeletion() {
    setToDelete(null);
  }

  async function confirmDeletion() {
    if (toDelete) {
      // removed deleted nav map from record
      const { [toDelete]: _deleted, ...newNavMaps } = navMaps;
      await localforage.removeItem(toDelete);

      setNames(names.filter((n) => n !== toDelete));
      setNavMaps(newNavMaps);
      setToDelete(null);
    }
  }

  return (
    <>
      <Stack direction="row" alignItems="center" gap={3}>
        {names.map((name) => (
          <Card
            key={name}
            sx={{ maxWidth: 345, display: "flex", flexDirection: "column" }}
          >
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
              <Button size="small" component={Link} to={`/viewer/${name}/`}>
                View
              </Button>
              <Button size="small" component={Link} to={`/editor/${name}/`}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setToDelete(name);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      <Dialog open={toDelete !== null} onClose={dismissDeletion}>
        <DialogTitle>Delete {toDelete}?</DialogTitle>
        <DialogActions>
          <Button onClick={dismissDeletion}>Cancel</Button>
          <Button
            onClick={() => {
              void confirmDeletion();
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default VFEList;
