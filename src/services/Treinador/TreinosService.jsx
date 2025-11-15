// src/services/TreinosService.jsx
import axios from "axios";

const API_URL = "http://localhost:3000/treinos";

// 🔹 Recupera o token salvo no login
const getAuthHeader = () => {
  const token = localStorage.getItem("trainer_token");
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Buscar todos os treinos do treinador
export const getTreinos = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data.treinos || [];
  } catch (error) {
    console.error("Erro ao buscar treinos:", error.response?.data || error);
    return [];
  }
};

// 🔹 Criar novo treino
export const createTreino = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar treino:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Deletar treino por ID
export const deleteTreino = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Erro ao deletar treino:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Atualizar treino
export const updateTreino = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar treino:", error.response?.data || error);
    throw error;
  }
};
