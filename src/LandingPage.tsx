import DesktopWindowsSharpIcon from "@mui/icons-material/DesktopWindowsSharp";
import LibraryAddSharpIcon from "@mui/icons-material/LibraryAddSharp";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Typography,
} from "@mui/material";

interface LandingPageProps {
  onLoadTestVFE: () => void;
  onCreateVFE: () => void;
}

function LandingPage({ onLoadTestVFE, onCreateVFE }: LandingPageProps) {
  const drawerWidth = 240;

  return (
    // MUI template for clipped drawer landing page layout
    // https://mui.com/material-ui/react-drawer/
    <Box sx={{ display: "flex" }}>
      <CssBaseline>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component={"div"}>
              Virtual Field Guide Editor
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        ></Drawer>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              "View Prototype",
              "Add Virtual Field Environment",
              "Add Prototype",
            ].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? (
                      <DesktopWindowsSharpIcon onClick={onLoadTestVFE} />
                    ) : (
                      <LibraryAddSharpIcon onClick={onCreateVFE} />
                    )}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </CssBaseline>
    </Box>
  );
}

export default LandingPage;
// <div
//   style={{
//     height: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
//   }}
// >
//   <h1> Welcome to the Virtual Field Enviornment (VFE) </h1>
//   <p> Explore and create virtual field enviornments! </p>

//   <Button
//     variant="contained"
//     onClick={onLoadTestVFE}
//     style={{
//       padding: "10px 20px",
//       margin: "20px",
//     }}
//   >
//     Open Prototype
//   </Button>
//   <Button
//     variant="contained"
//     onClick={onCreateVFE}
//     style={{
//       padding: "10px 20px",
//       margin: "20px",
//     }}
//   >
//     Create Virtual Field Environment
//   </Button>
// </div>
