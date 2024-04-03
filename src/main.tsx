import React from "react";
import ReactDOM from "react-dom/client";

import AppRoot from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppRoot /> {/* Updated component reference */}
    </React.StrictMode>,
  );
} else {
  console.error("root element is missing");
}
