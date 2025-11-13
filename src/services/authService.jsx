// src/services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const registerTrainer = async (nome, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Treinadores`, {
      nome,
      email,
      password,
    });

    return response.data; // axios já converte o JSON automaticamente
  } catch (error) {
    console.error("Erro no registro:", error);
    // tratamento de erro consistente
    const message =
      error.response?.data?.message || "Erro ao registrar treinador";
    throw new Error(message);
  }
};

export const loginTrainer = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/token/treinador`, {
      email,
      password,
    });

    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    const message = error.response?.data?.message || "Erro ao fazer login";
    throw new Error(message);
  }
};
