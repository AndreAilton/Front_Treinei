import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/treinos-dias`;

// 🔹 Recupera o token salvo no login
const getAuthHeader = () => {
  const token = localStorage.getItem("trainer_token");
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Buscar todos os Treinos-Dias
export const getTreinoDias = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data.treinosDia || [];
  } catch (error) {
    console.error("Erro ao buscar Treinos-Dias:", error.response?.data || error);
    return [];
  }
};


// 🔹 Criar novo Treino-Dia
export const createTreinoDia = async (treinoDiaData) => {
  try {
    const response = await axios.post(API_URL, treinoDiaData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data.treinoDia;
  } catch (error) {
    console.error("Erro ao criar Treino-Dia:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Deletar Treino-Dia por ID
export const deleteTreinoDia = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Erro ao deletar Treino-Dia:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Atualizar Treino-Dia por ID
export const updateTreinoDia = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data.treinoDia;
  } catch (error) {
    console.error("Erro ao atualizar Treino-Dia:", error.response?.data || error);
    throw error;
  }
};
