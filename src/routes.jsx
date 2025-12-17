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
import MeusTreinos from "./components/MeusTreinos";
import AlterarSenha from "./components/AlterarSenha";
// PROTEÇÕES
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* LOGIN */}
      <Route path="/auth-treinador" element={<Auth />} />
      <Route path="/auth-usuario" element={<AuthUsuario />} />
      <Route path="/reset-password/:token" element={<AlterarSenha />} />

      {/* ROTAS DO TREINADOR */}
      <Route
        path="/exercicios"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DashBoard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/treinos"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <TreinosDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/treino-dias"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <TreinoDias />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vincular-treino-usuario"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <VincularTreinoUsuario />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dietas"
        element={
          <ProtectedRoute>
            <RoleRoute role="trainer">
              <DietaDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* ROTAS DO USUÁRIO */}
      <Route
        path="/escolher-treinador"
        element={
          <ProtectedRoute>
            <RoleRoute role="usuario">
              <EscolherTreinador />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/meu-treino"
        element={
          <ProtectedRoute>
            <RoleRoute role="usuario">
              <MeusTreinos />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
