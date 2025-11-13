import React from "react";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Cabeçalho */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Treinei <span className="text-blue-500">Fitness</span>
        </h1>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/" className="hover:text-blue-500 transition">Home</a>
          <a href="/auth-usuario" className="hover:text-blue-500 transition">Registrar Usuário</a>
          <a href="/vincular-treino-usuario" className="hover:text-blue-500 transition">Vincular Treino Usuário</a>
          <a href="/treino-dias" className="hover:text-blue-500 transition">TreinosDias</a>
          <a href="/treinos" className="hover:text-blue-500 transition">Treinos</a>
          <a href="/exercicios" className="hover:text-blue-500 transition">Exercicios</a>
          <a href="/auth" className="hover:text-blue-500 transition">Login</a>
          

        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Transforme seu corpo e mente
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Alcance seus objetivos com treinos personalizados, planos de dieta e acompanhamento do seu treinador.
        </p>
        <a
          href="/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-600 transition"
        >
          Começar Agora
        </a>
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

      {/* Rodapé */}
      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Treinei Fitness — Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomePage;
