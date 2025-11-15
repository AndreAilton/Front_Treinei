// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginTrainer } from "../services/Treinador/authService";
import { getdadosTreinador } from "../services/Treinador/treinadorService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Dados do treinador
  const [token, setToken] = useState(null); // Token JWT
  const [loading, setLoading] = useState(true);

  // Verifica se já há token salvo ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Função para login
  const login = async (email, senha) => {
    try {
      const data = await loginTrainer(email, senha);

      if (data.token) {
        setToken(data.token);
        setUser(data.treinador || { email });
        localStorage.setItem("trainer_token", data.token);
        const treinador = await getdadosTreinador();
        console.log("Dados do treinador:", treinador);
        localStorage.setItem("trainer", JSON.stringify(treinador));
      }
    } catch (error) {
      throw error;
    }
  };

  // Função para logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
