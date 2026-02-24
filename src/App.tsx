import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import UpdatePage from "./pages/UpdatePage/UpdatePage";
import "./styles/common.scss";
import { Progress } from "./components/Progress/Progress";

export default function App() {
  return (
    <div className="container">
      <div className="navigation">
        <h1 className="navigation__header">Планировщик задач</h1>
        <div className="navigation__nav">
          <NavLink to={"/"} end>
            Дашборд +
          </NavLink>
          <NavLink to={"/update"} end>
            Добавить задачу/цель +
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
