import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

const getAuthHeader = () => {
  const token = localStorage.getItem("usuario_token");
  return { Authorization: `Bearer ${token}` };
};


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

export const getdadosUsuario = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`, {
      headers: getAuthHeader(),
    });
    return response;
  } catch (error) {
    console.error("Erro ao carregar Usuario", error.response?.data || error);
    return [];
  }
};



// 🔹 Logout
export const logoutUsuario = () => {
  localStorage.removeItem("usuario_token");
  localStorage.removeItem("usuario");
  console.log("🚪 Logout de usuário realizado");
};

export default api;
