import axios from "axios";

const API_URL = "http://localhost:3000/dietas";

const getAuthHeader = () => {
  const token = localStorage.getItem("trainer_token");
  return { Authorization: `Bearer ${token}` };
};


// 📌 Criar dieta (multipart)
export const createDieta = async (file, descricao) => {
  try {
    const formData = new FormData();
    formData.append("file", file);          // arquivo enviado
    formData.append("descricao", descricao);

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(), // adiciona token se existir
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar dieta:", error.response?.data || error);
    throw error;
  }
};

// 📌 Buscar todas as dietas
export const getDietas = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data.files;
  } catch (error) {
    console.error("Erro ao buscar dietas:", error.response?.data || error);
    throw error;
  }
};

// 📌 Buscar dieta por ID
export const getDietaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dieta:", error.response?.data || error);
    throw error;
  }
};

// 📌 Deletar dieta
export const deleteDieta = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar dieta:", error.response?.data || error);
    throw error;
  }
};
