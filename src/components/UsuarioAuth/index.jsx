import React, { useState } from "react";
import {
  loginUsuario,
  registerUsuario,
} from "../../services/Usuario/usuarioAuthService";
import { logoutTrainer } from "../../services/Treinador/authService";
import { useNavigate } from "react-router-dom";

const UsuarioAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
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
        // 🔹 Garante que treinador não fique logado
        logoutTrainer();

        const data = await loginUsuario(email, password);
        alert(`✅ Bem-vindo, ${data.usuario?.nome || "usuário"}!`);
        navigate("/");
      } else {
        const usuarioData = { nome, telefone, email, password };
        await registerUsuario(usuarioData);
        alert("✅ Registro realizado com sucesso!");
        setIsLogin(true);
      }

      setNome("");
      setTelefone("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Erro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {isLogin ? "Login de Usuário" : "Cadastro de Usuário"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  placeholder="Seu telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
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

export default UsuarioAuth;
