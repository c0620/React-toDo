import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TaskManager } from "./components/TaskManager";
import Dashboard from "./components/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskManager>
      <Dashboard />
    </TaskManager>
  </StrictMode>
);
