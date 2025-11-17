import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  // role local para renderizar UI (sincronizado com AuthContext e storage)
  const [role, setRole] = useState(auth?.tipo || null);

  useEffect(() => {
    // Sempre que o contexto mudar, atualiza role
    setRole(auth?.tipo || null);
  }, [auth?.tipo, auth?.token, auth?.user]);

  useEffect(() => {
    // Escuta evento custom em mesma aba
    const onAuthChanged = () => {
      const trainerToken = localStorage.getItem("trainer_token");
      const usuarioToken = localStorage.getItem("usuario_token");

      if (trainerToken) setRole("trainer");
      else if (usuarioToken) setRole("usuario");
      else setRole(null);
    };

    // Escuta storage (outras abas)
    const onStorage = (e) => {
      // escuta chave que o AuthContext altera ou remoção de tokens
      if (
        e.key === "trainer_token" ||
        e.key === "usuario_token" ||
        e.key === "trainer" ||
        e.key === "usuario" ||
        e.key === "__auth_last_change"
      ) {
        onAuthChanged();
      }
    };

    window.addEventListener("authChanged", onAuthChanged);
    window.addEventListener("storage", onStorage);

    // cleanup
    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    navigate("/");
    if (auth && auth.logout) auth.logout();
    else {
      // fallback
      localStorage.removeItem("trainer_token");
      localStorage.removeItem("usuario_token");
      localStorage.removeItem("trainer");
      localStorage.removeItem("usuario");
      setRole(null);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Treinei <span className="text-blue-500">Fitness</span>
        </h1>

        <nav className="flex items-center gap-4 text-gray-700 font-medium">
          {role === "usuario" && (
            <>
              <Link
                to="/escolher-treinador"
                className="hover:text-blue-500 transition"
              >
                Escolher Treinador
              </Link>
              <Link to="/meu-treino" className="hover:text-blue-500 transition">
                Meu Treino
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded hover:bg-red-50 hover:text-red-600 transition"
              >
                Sair
              </button>
            </>
          )}

          {role === "trainer" && (
            <>
              <Link to="/exercicios" className="hover:text-blue-500 transition">
                Meus Exercícios
              </Link>
              <Link to="/treinos" className="hover:text-blue-500 transition">
                Gerenciar Treinos
              </Link>
              <Link
                to="/vincular-treino-usuario"
                className="hover:text-blue-500 transition"
              >
                Meus Alunos
              </Link>
              <Link
                to="/treino-dias"
                className="hover:text-blue-500 transition"
              >
                Treino Semanal
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded hover:bg-red-50 hover:text-red-600 transition"
              >
                Sair
              </button>
            </>
          )}

          {!role && (
            <>
              <button
                onClick={() => setShowLoginOptions(true)}
                className="hover:text-blue-500 transition"
              >
                Login
              </button>
            </>
          )}
        </nav>
      </div>
      {showLoginOptions && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setShowLoginOptions(false)}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Entrar como:
            </h2>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate("/auth-usuario")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                👤 Usuário
              </button>

              <button
                onClick={() => navigate("/auth-treinador")}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                🏋️ Treinador
              </button>

              <button
                onClick={() => setShowLoginOptions(false)}
                className="w-full bg-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
