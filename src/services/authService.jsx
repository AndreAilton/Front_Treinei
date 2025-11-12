// src/services/authService.js
const API_BASE_URL = "http://localhost:3000";

export const registerTrainer = async (nome, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Treinadores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, password }), // 👈 corrigido aqui
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao registrar treinador");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};

export const loginTrainer = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/treinador`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // 👈 corrigido também
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao fazer login");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
