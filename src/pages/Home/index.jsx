import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      

      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Transforme seu corpo e mente
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Alcance seus objetivos com treinos personalizados, planos de dieta e acompanhamento do seu treinador.
        </p>

        {/* Botão "Começar Agora" abre o modal */}
        <button
          onClick={() => setShowLoginOptions(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-600 transition"
        >
          Começar Agora
        </button>
      </section>

      {/* Benefícios */}
      <section className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl">
        <div className="bg-white shadow-md p-6 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-gray-800">🏋️ Treinos Personalizados</h3>
          <p className="text-gray-600">
            Planos feitos sob medida para o seu nível e objetivo físico.
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-gray-800">🥗 Planos Alimentares</h3>
          <p className="text-gray-600">
            Dietas criadas por especialistas para potencializar seus resultados.
          </p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-gray-800">📊 Acompanhamento</h3>
          <p className="text-gray-600">
            Monitore seu progresso com gráficos e relatórios semanais.
          </p>
        </div>
      </section>

      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Treinei Fitness — Todos os direitos reservados.
      </footer>

      {/* ===== MODAL DE LOGIN ===== */}
      {showLoginOptions && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-90 flex items-center justify-center p-4" onClick={() => setShowLoginOptions(false)}>
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
    </div>
  );
};

export default HomePage;
