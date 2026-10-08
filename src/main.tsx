import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ScriptProvider } from "./context/ScriptContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScriptProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ScriptProvider>
  </StrictMode>,
);
