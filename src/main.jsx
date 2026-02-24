import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/reset.css";
import "./index.css";
import { TaskManager } from "./components/TaskManager";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskManager>
      <RouterProvider router={router} />
    </TaskManager>
  </StrictMode>
);
