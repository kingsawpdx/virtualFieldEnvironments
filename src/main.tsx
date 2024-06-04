import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { createTheme } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppRoot from "./App.tsx";
import "./index.css";

export const theme = createTheme({
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
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AppRoot /> {/* Updated component reference */}
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  console.error("root element is missing");
}
