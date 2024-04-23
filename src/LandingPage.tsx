import AddPhotoAlternateSharpIcon from "@mui/icons-material/AddPhotoAlternateSharp";
import DesktopWindowsSharpIcon from "@mui/icons-material/DesktopWindowsSharp";
import EditLocationAltOutlinedIcon from "@mui/icons-material/EditLocationAltOutlined";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import LibraryAddSharpIcon from "@mui/icons-material/LibraryAddSharp";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Header from "./Header";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
}

function LandingPage({ onLoadTestVFE, onCreateVFE }: LandingPageProps) {
  // Responsive screen setup
  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = isSmallerScreen ? "20%" : "20%";

  return (
    // MUI template for clipped drawer landing page layout
    // https://mui.com/material-ui/react-drawer/
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onCreateVFE={onCreateVFE} />
    </Box>
  );
}

export default LandingPage;
