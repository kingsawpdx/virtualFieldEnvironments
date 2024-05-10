import {
  ExitToAppSharp,
  LibraryAddSharp,
  TerrainSharp,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

export interface HeaderProps {
  onCreateVFE: () => void;
  onLoadTestVFE: () => void;
}

function Header({ onCreateVFE, onLoadTestVFE }: HeaderProps) {
  return (
    <AppBar sx={{ position: "sticky", inset: "top" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack direction="row">
          <IconButton>
            <TerrainSharp
              sx={{ color: "primary.contrastText", fontSize: "50px" }}
            />
          </IconButton>
          <Typography variant="h1" sx={{ fontSize: "50px", margin: "auto" }}>
            Virtual Field Guides
          </Typography>
        </Stack>
        <Stack direction="row">
          <Tooltip title="Create">
            <IconButton onClick={onCreateVFE}>
              <LibraryAddSharp sx={{ color: "primary.contrastText" }} />
            </IconButton>
          </Tooltip>
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
