import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("🔧 API_BASE_URL:", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Registrar treinador
export const registerTrainer = async (nome, email, password) => {
  try {
    const { data } = await api.post("/Treinadores", {
      nome,
      email,
      password,
    });

    return data;
  } catch (error) {
    console.error(
      "❌ Erro no registro do treinador:",
      error.response?.data || error
    );

    // Tratamento de erro consistente
    const message =
      error.response?.data?.errors?.join(" ") ||
      error.response?.data?.message ||
      "Erro ao registrar treinador.";
    throw new Error(message);
  }
};

// 🔹 Login de treinador
export const loginTrainer = async (email, password) => {
  try {
    const { data } = await api.post("/token/treinador", {
      email,
      password,
    });

    if (data.token) {
      // ✅ Remove token do usuário para evitar conflito
      localStorage.removeItem("usuario_token");

      // ✅ Armazena token e dados do treinador
      localStorage.setItem("trainer_token", data.token);
    }

    return data;
  } catch (error) {
    console.error(
      "❌ Erro no login do treinador:",
      error.response?.data || error
    );

    const message =
      error.response?.data?.errors?.join(" ") ||
      error.response?.data?.message ||
      "Erro ao fazer login.";
    throw new Error(message);
  }
};

export const esqueciSenhaTreinador= async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/treinadores/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar email de recuperação", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
      "Erro ao enviar email de recuperação."
    );
  }
};

export const resetarSenhaTreinador = async (email, token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/treinadores/reset-password`, {
      email,
      password: newPassword,
      token
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao resetar senha", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
      "Erro ao resetar senha."
    );
  }
};

// 🔹 Logout de treinador
export const logoutTrainer = () => {
  localStorage.removeItem("trainer_token");
  localStorage.removeItem("trainer");
  console.log("🚪 Logout de treinador realizado.");
};

export default api;
