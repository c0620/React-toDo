import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./index.css";
import { TaskManager } from "./components/TaskManager";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskManager>
      <Dashboard />
    </TaskManager>
  </StrictMode>
);
