import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/TrainerLogin";
import DashBoard from "./components/ExercicioDashboard";
import TreinosDashboard from "./components/TreinosDashboard";
import TreinoDias from "./components/TreinoDias";
import VincularTreinoUsuario from "./components/VincularTreinoUsuario";
import AuthUsuario from "./components/UsuarioAuth";
export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/exercicios" element={<DashBoard />} />
      <Route path="/treinos" element={<TreinosDashboard />} />
      <Route path="/treino-dias" element={<TreinoDias />} />
      <Route path="/vincular-treino-usuario" element={<VincularTreinoUsuario />} />
      <Route path="/auth-usuario" element={<AuthUsuario />} />
    </Routes>
  );
}