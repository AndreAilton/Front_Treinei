// src/components/ExercicioForm.jsx
import React, { useState } from "react";
import { createExercicio } from "../../services/ExerciciosService";

const ExercicioForm = ({ onSuccess, onClose }) => {
  const [exercicio, setExercicio] = useState({
    nome: "",
    Categoria: "",
    Grupo_Muscular: "",
    Descricao: "",
    Aparelho: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setExercicio((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await createExercicio(exercicio);
      setMensagem("✅ Exercício criado com sucesso!");
      onSuccess(); // 🔹 avisa o pai para recarregar a lista
      setTimeout(onClose, 1000); // fecha o modal após sucesso
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao criar exercício. Veja o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Novo Exercício
      </h2>

      {mensagem && (
        <p
          className={`text-center mb-4 ${
            mensagem.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensagem}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          placeholder="Nome"
          value={exercicio.nome}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
        <input
          name="Categoria"
          placeholder="Categoria"
          value={exercicio.Categoria}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
        <input
          name="Grupo_Muscular"
          placeholder="Grupo Muscular"
          value={exercicio.Grupo_Muscular}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
        <textarea
          name="Descricao"
          placeholder="Descrição"
          value={exercicio.Descricao}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        ></textarea>
        <input
          name="Aparelho"
          placeholder="Aparelho"
          value={exercicio.Aparelho}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />
        <input
          type="file"
          name="file"
          accept="video/*"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Criar Exercício"}
        </button>
      </form>
    </div>
  );
};

export default ExercicioForm;
