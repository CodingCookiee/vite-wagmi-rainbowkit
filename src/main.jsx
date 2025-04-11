import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Web3Provider } from "./providers/Web3Provider";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3Provider>
      <App/>
    </Web3Provider>
  </StrictMode>
);
