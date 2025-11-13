import axios from "axios";

const API_URL = "http://localhost:3000/usuario-treino";

// 🔹 Recupera o token salvo no login
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Buscar todos os vínculos entre usuários e treinos
export const getTreinoUsuarios = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data.usuarioTreinos || [];
  } catch (error) {
    console.error("Erro ao buscar vínculos usuário-treino:", error.response?.data || error);
    return [];
  }
};

// 🔹 Criar um novo vínculo (associar usuário a treino)
export const createTreinoUsuario = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao vincular treino ao usuário:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Deletar um vínculo específico por ID
export const deleteTreinoUsuario = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Erro ao deletar vínculo:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Atualizar vínculo usuário-treino (ex: mudar treino de um usuário)
export const updateTreinoUsuario = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar vínculo usuário-treino:", error.response?.data || error);
    throw error;
  }
};
