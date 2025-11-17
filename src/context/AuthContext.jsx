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
  const [user, setUser] = useState(null); // Dados do treinador
  const [token, setToken] = useState(null); // Token JWT
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState(null);

  // Verifica se já há token salvo ao iniciar
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
    // evento custom para componentes na mesma aba
    window.dispatchEvent(new Event("authChanged"));
    // também atualiza storage (gera storage event em outras tabs)
    try {
      localStorage.setItem("__auth_last_change", Date.now().toString());
    } catch (e) {
      // ignore
    }
  };

  // Função para login
  const login = async (email, senha) => {
    try {
      const data = await loginTrainer(email, senha);
      if (data.token) {
        setToken(data.token);
        setUser(data.treinador || { email });
        localStorage.setItem("trainer_token", data.token);
        const treinador = await getdadosTreinador();
        localStorage.setItem("trainer", JSON.stringify(treinador));
      }
      notifyAuthChanged();
    } catch (error) {
      throw error;
    }
  };

  const LoginUsuario = async (email, senha) => {
    try {
      const data = await loginUsuario(email, senha);
      if (data.token) {
        setToken(data.token);
        setUser(data.usuario || { email });
        localStorage.setItem("usuario_token", data.token);
        const usuario = await getdadosUsuario();
        localStorage.setItem("usuario", JSON.stringify(usuario));
      }
      notifyAuthChanged();
    } catch (error) {
      throw error;
    }
  };

  // Função para logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("trainer_token");
    localStorage.removeItem("trainer");
    localStorage.removeItem("usuario_token");
    localStorage.removeItem("usuario");
    setTipo(null);
    notifyAuthChanged();

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        tipo,
        login,
        LoginUsuario,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
