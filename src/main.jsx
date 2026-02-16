import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./index.css";
import { TaskManager } from "./components/TaskManager";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <TaskManager>
        <App />
      </TaskManager>
    </BrowserRouter>
  </StrictMode>
);
