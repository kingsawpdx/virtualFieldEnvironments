import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VFEList() {
  const [names, setNames] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setNames(await localforage.keys());
    }

    void load();
  }, []);

  return names.map((name) => (
    <Card key={name} sx={{ maxWidth: 345 }}>
      <CardHeader title={name}> </CardHeader>
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
  ));
}

export default VFEList;
