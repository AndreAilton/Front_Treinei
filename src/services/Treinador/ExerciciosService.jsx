// src/services/ExerciciosService.jsx
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/exercicios`;

// 🔹 Recupera o token salvo no login
const getAuthHeader = () => {
  const token = localStorage.getItem("trainer_token");
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Buscar todos os exercícios do treinador
export const getExercicios = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });

    // ✅ Retorna o array correto da resposta
    return response.data.exercicios || [];
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error.response?.data || error);
    return [];
  }
};

// 🔹 Buscar exercício por ID (para visualizar e editar)
export const getExercicioById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data; // retorna o exercício e vídeos associados
  } catch (error) {
    console.error("Erro ao buscar exercício:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Criar novo exercício (com vídeo opcional)
export const createExercicio = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar exercício:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Atualizar dados do exercício (PUT)
export const updateExercicio = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar exercício:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Deletar exercício por ID
export const deleteExercicio = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Erro ao deletar exercício:", error.response?.data || error);
    throw error;
  }
};
