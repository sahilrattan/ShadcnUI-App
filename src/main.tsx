import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DndContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DndContext>
  </StrictMode>
);
