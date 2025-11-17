import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./components/TrainerLogin";
import DashBoard from "./components/ExercicioDashboard";
import TreinosDashboard from "./components/TreinosDashboard";
import TreinoDias from "./components/TreinoDias";
import VincularTreinoUsuario from "./components/MeusAlunos";
import AuthUsuario from "./components/UsuarioAuth";
import EscolherTreinador from "./components/EscolherTreinador";
import DietaDashboard from "./components/DietaDashboard";
export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth-treinador" element={<Auth />} />
      <Route path="/exercicios" element={<DashBoard />} />
      <Route path="/treinos" element={<TreinosDashboard />} />
      <Route path="/treino-dias" element={<TreinoDias />} />
      <Route path="/vincular-treino-usuario" element={<VincularTreinoUsuario />} />
      <Route path="/auth-usuario" element={<AuthUsuario />} />
      <Route path="/escolher-treinador" element={<EscolherTreinador />} />
      <Route path="/dietas" element={<DietaDashboard />} />
    </Routes>
  );
}