import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/TrainerLogin";
import DashBoard from "./components/ExercicioDashboard";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/exercicios" element={<DashBoard />} />
    </Routes>
  );
}