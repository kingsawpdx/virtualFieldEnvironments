import { useNavigate } from "react-router-dom";

import {
  ExitToAppSharp,
  LibraryAddSharp,
  TerrainSharp,
} from "@mui/icons-material";
import { AppBar, Button, IconButton, Stack, Typography } from "@mui/material";

export interface HeaderProps {
  onCreateVFE: () => void;
  onLoadTestVFE: () => void;
}

function Header({ onCreateVFE, onLoadTestVFE }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ position: "sticky", inset: "top" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack direction="row">
          <IconButton
            onClick={() => {
              navigate("/");
            }}
          >
            <TerrainSharp
              sx={{ color: "primary.contrastText", fontSize: "50px" }}
            />
          </IconButton>
          <Typography variant="h1" sx={{ fontSize: "50px", margin: "auto" }}>
            Virtual Field Guides
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <Stack sx={{ justifyContent: "space-around" }}>
            <Button
              onClick={onCreateVFE}
              endIcon={
                <LibraryAddSharp sx={{ color: "primary.contrastText" }} />
              }
            >
              <Typography sx={{ color: "primary.contrastText" }}>
                Create
              </Typography>
            </Button>
          </Stack>
          <Stack sx={{ justifyContent: "space-around", paddingRight: "10px" }}>
            <Button
              sx={{ backgroundColor: "primary.dark" }}
              onClick={onLoadTestVFE}
              endIcon={
                <ExitToAppSharp sx={{ color: "primary.contrastText" }} />
              }
            >
              <Typography sx={{ color: "primary.contrastText" }}>
                Demo
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </AppBar>
  );
}

export default Header;
