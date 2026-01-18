import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TaskManager } from "./TaskManager";
import Dashboard from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskManager>
      <Dashboard />
    </TaskManager>
  </StrictMode>
);
