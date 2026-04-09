import { createHashRouter, useAsyncError } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import UpdatePage, { updateLoader } from "./pages/UpdatePage/UpdatePage";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        Component: DashboardPage,
        ErrorBoundary: ErrorPage,
      },
      {
        path: "update/:type?/:id?",
        Component: UpdatePage,
        loader: updateLoader,
        // action: updateAction,
        ErrorBoundary: ErrorPage,
      },
    ],
  },
  {
    path: "*",
    element: <div>Страница не найдена</div>,
  },
]);

export type AppRouter = typeof router;
