import axios from "axios";

const API_URL = "http://localhost:3000/treinadores";

const getAuthHeader = () => {
  const token = localStorage.getItem("trainer_token");
  return { Authorization: `Bearer ${token}` };
};

// 🔹 Buscar todos os treinadores (somente após login)
export const getAllTreinadores = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: getAuthHeader(),
    });

    return response.data.treinadores || [];
  } catch (error) {
    console.error("Erro ao carregar treinadores:", error.response?.data || error);
    return [];
  }
};


export const getdadosTreinador = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });

    return response.data.treinador || [];
  } catch (error) {
    console.error("Erro ao carregar treinadores:", error.response?.data || error);
    return [];
  }
};
