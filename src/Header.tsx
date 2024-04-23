import {
  DesktopWindowsSharp,
  EditSharp,
  LibraryAddSharp,
  LockOutlined,
  TerrainSharp,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

interface HeaderProps {
  onCreateVFE: () => void;
}

function Header({ onCreateVFE }: HeaderProps) {
  return (
    <AppBar>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <IconButton>
          <TerrainSharp sx={{ color: "#fefefe", fontSize: "50px" }} />
        </IconButton>
        <Typography variant="h1" sx={{ fontSize: "50px" }}>
          Virtual Field Guides
        </Typography>
        <Stack direction="row">
          <IconButton>
            <DesktopWindowsSharp sx={{ color: "#fefefe" }} />
          </IconButton>
          <IconButton>
            <LibraryAddSharp sx={{ color: "#fefefe" }} />
          </IconButton>
          <IconButton>
            <EditSharp sx={{ color: "#fefefe" }} />
          </IconButton>
          <Stack sx={{ justifyContent: "space-around" }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlined />
            </Avatar>
          </Stack>
        </Stack>
      </Stack>
    </AppBar>
  );
}

export default Header;
