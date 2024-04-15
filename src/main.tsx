import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import AppRoot from "./App.tsx";
import "./index.css";

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AppRoot /> {/* Updated component reference */}
      </ThemeProvider>
    </React.StrictMode>,
  );
} else {
  console.error("root element is missing");
}
