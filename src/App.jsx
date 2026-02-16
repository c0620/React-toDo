import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import UpdatePage from "./pages/UpdatePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/update" element={<UpdatePage />} />
    </Routes>
  );
}
