import React, { useState } from "react";

import LandingPage from "./LandingPage.tsx";
import App from "./Prototype.tsx";

// Main component acts as a main entry point for the application
// Should decide what we are doing, going to LandingPage/Rendering VFE
const AppRoot = () => {
  // Decide state, should manage whether the VFE should be displayed or the LandingPage should be displayed
  const [showApp, setShowApp] = useState(false);

  //Create a function to set useState true
  const handleLoadTestVFE = () => {
    setShowApp(true);
  };

  return (
    <React.StrictMode>
      {!showApp ? (
        <LandingPage onLoadTestVFE={handleLoadTestVFE} />
      ) : (
        //If ShowApp changes, render App
        <App />
      )}
    </React.StrictMode>
  );
};

export default AppRoot;
