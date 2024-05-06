
import { Navigate } from "react-router-dom";

import dataArray from "./data.json";

function Prototype() {
  window.localStorage.setItem("prototype", JSON.stringify(dataArray));

  return <Navigate to="/viewer/prototype/" replace={true} />;
}

export default Prototype;
