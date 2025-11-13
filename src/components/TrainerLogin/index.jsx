import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { registerTrainer } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const TrainerAuth = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 🔹 LOGIN via Context (que usa o authService)
        await login(email, password);
        alert("✅ Login realizado com sucesso!");
      } else {
        // 🔹 REGISTRO via Service
        await registerTrainer(nome, email, password);
        alert("✅ Registro realizado com sucesso!");
        setIsLogin(true);
        await login(email, password);
        setNome("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Erro: " + (err.message || "Falha na requisição."));
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  // Se já estiver logado, mostra mensagem de boas-vindas
  if (isAuthenticated) {
    navigate("/");
    alert("✅ Treinador Autenticado Com Sucesso!");
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold text-blue-600">
          👋 Bem-vindo, {user?.nome || user?.email}!
        </h2>
        <p className="text-gray-500 mt-2">Você já está autenticado.</p>
      </div>
    );
    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {isLogin ? "Login do Treinador" : "Registrar Treinador"}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Registrar"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => {
              setError("");
              setIsLogin(!isLogin);
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? "Registre-se" : "Faça login"}
          </button>
        </p>

        <p className="text-center text-gray-400 text-sm mt-6">
          Treinei Fitness © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default TrainerAuth;