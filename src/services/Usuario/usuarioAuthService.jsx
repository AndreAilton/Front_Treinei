import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Login de usuário
export const loginUsuario = async (email, password) => {
  try {
    const { data } = await api.post("/token", { email, password });

    if (data?.token) {
      // Ao logar o usuário, remove tokens de treinador
      localStorage.removeItem("trainer_token");
      localStorage.setItem("usuario_token", data.token);

    }

    return data;
  } catch (error) {
    console.error("❌ Erro no login do usuário:", error.response?.data || error);
    const msg =
      error.response?.data?.errors?.join(" ") ||
      error.response?.data?.message ||
      "Erro ao fazer login.";
    throw new Error(msg);
  }
};

// 🔹 Registrar novo usuário
export const registerUsuario = async (usuarioData) => {
  try {
    const { data } = await api.post("/usuarios", usuarioData);
    return data;
  } catch (error) {
    console.error("❌ Erro no registro de usuário:", error.response?.data || error);
    const msg =
      error.response?.data?.errors?.join(" ") ||
      error.response?.data?.message ||
      "Erro ao registrar usuário.";
    throw new Error(msg);
  }
};

// 🔹 Logout
export const logoutUsuario = () => {
  localStorage.removeItem("usuario_token");
  localStorage.removeItem("usuario");
  console.log("🚪 Logout de usuário realizado");
};

export default api;
