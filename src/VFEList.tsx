import {
  CardActionArea,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { VFE } from "./DataStructures";
import { deleteStoredVFE } from "./FileOperations";
import { confirmMUI } from "./StyledConfirmWrapper";
import { convertStoredToRuntime } from "./VFEConversion";

type NavMapRecord = Partial<Record<string, string>>;

function VFEList() {
  const [names, setNames] = useState<string[]>([]);
  const [navMaps, setNavMaps] = useState<NavMapRecord>({});

  useEffect(() => {
    async function load() {
      const keys = await localforage.keys();
      setNames(keys);

      const newNavMaps: NavMapRecord = {};
      for (const key of keys) {
        const localVFE = await localforage.getItem<VFE>(key);
        if (localVFE?.map) {
          const networkMap = await convertStoredToRuntime(localVFE.name)(
            localVFE.map.src,
          );
          newNavMaps[key] = networkMap.path;
        }
      }
      setNavMaps(newNavMaps);
    }

    void load();
  }, []);

  async function deleteVFE(toDelete: string) {
    if (await confirmMUI(`Delete ${toDelete}?`, { accept: "Delete" })) {
      // removed deleted nav map from record
      const { [toDelete]: _deleted, ...newNavMaps } = navMaps;
      localStorage.removeItem("visitedState");
      await deleteStoredVFE(toDelete);

      setNames(names.filter((n) => n !== toDelete));
      setNavMaps(newNavMaps);
    }
  }

  return (
    <Container sx={{ padding: 3 }}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {names.map((name) => (
          <Grid item key={name} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardActionArea component={Link} to={`/viewer/${name}`}>
                <CardHeader
                  title={<Typography variant="h6">{name}</Typography>}
                  disableTypography
                />

                {navMaps[name] ? (
                  <CardMedia sx={{ height: 140 }} image={navMaps[name]} />
                ) : (
                  <Skeleton height={140} variant="rectangular" />
                )}
              </CardActionArea>

              <CardActions>
                <Button size="small" component={Link} to={`/viewer/${name}`}>
                  View
                </Button>
                <Button size="small" component={Link} to={`/editor/${name}`}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    void deleteVFE(name);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default VFEList;
