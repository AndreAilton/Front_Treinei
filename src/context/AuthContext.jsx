// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginTrainer } from "../services/Treinador/authService";
import { getdadosTreinador } from "../services/Treinador/treinadorService";
import {
  loginUsuario,
  getdadosUsuario,
} from "../services/Usuario/usuarioAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState(null);

  // Carrega dados do storage ao iniciar
  useEffect(() => {
    const trainerToken = localStorage.getItem("trainer_token");
    const usuarioToken = localStorage.getItem("usuario_token");

    if (trainerToken) {
      setToken(trainerToken);
      setTipo("trainer");
      setUser(JSON.parse(localStorage.getItem("trainer")) || null);
    } else if (usuarioToken) {
      setToken(usuarioToken);
      setTipo("usuario");
      setUser(JSON.parse(localStorage.getItem("usuario")) || null);
    } else {
      setToken(null);
      setTipo(null);
      setUser(null);
    }

    setLoading(false);
  }, []);

  const notifyAuthChanged = () => {
    window.dispatchEvent(new Event("authChanged"));
    try {
      localStorage.setItem("__auth_last_change", Date.now().toString());
    } catch {}
  };

  // LOGIN DO TREINADOR
  const login = async (email, senha) => {
    try {
      const data = await loginTrainer(email, senha);

      if (data.token) {
        setToken(data.token);
        setTipo("trainer"); // <-- ESSENCIAL
        localStorage.setItem("trainer_token", data.token);

        const treinador = await getdadosTreinador();
        setUser(treinador);
        localStorage.setItem("trainer", JSON.stringify(treinador));
      }

      notifyAuthChanged();
    } catch (error) {
      throw error;
    }
  };

  // LOGIN DO USUÁRIO
  const LoginUsuario = async (email, senha) => {
    try {
      const data = await loginUsuario(email, senha);

      if (data.token) {
        setToken(data.token);
        setTipo("usuario"); // <-- ESSENCIAL
        localStorage.setItem("usuario_token", data.token);

        const usuario = await getdadosUsuario();
        setUser(usuario);
        localStorage.setItem("usuario", JSON.stringify(usuario));
      }

      notifyAuthChanged();
    } catch (error) {
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    setTipo(null);

    localStorage.removeItem("trainer_token");
    localStorage.removeItem("trainer");
    localStorage.removeItem("usuario_token");
    localStorage.removeItem("usuario");

    notifyAuthChanged();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        tipo,
        isAuthenticated: !!user,
        login,
        LoginUsuario,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
