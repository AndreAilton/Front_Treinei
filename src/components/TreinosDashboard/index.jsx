import { useEffect, useState } from "react";
import {
  getTreinos,
  createTreino,
  deleteTreino,
  updateTreino,
} from "../../services/Treinador/TreinosService";

export default function TreinoDashboard() {
  const [treinos, setTreinos] = useState([]);
  const [filteredTreinos, setFilteredTreinos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({ nome: "" });
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTreinos();
  }, []);

  const loadTreinos = async () => {
    setLoading(true);
    try {
      const data = await getTreinos();
      const arr = Array.isArray(data) ? data : [];
      setTreinos(arr);
      setFilteredTreinos(arr);
    } catch (err) {
      console.error("Erro ao carregar treinos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = treinos;
    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredTreinos(filtered);
  }, [filters, treinos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTreino({ nome: form.nome });
      setShowModal(false);
      await loadTreinos();
      setForm({ nome: "" });
    } catch (err) {
      console.error("Erro ao criar treino:", err);
      alert("Erro ao criar treino. Veja o console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este treino?")) return;
    try {
      await deleteTreino(id);
      await loadTreinos();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTreino(editModal.id, editModal);
      setEditModal(null);
      await loadTreinos();
    } catch (err) {
      console.error("Erro ao atualizar treino:", err);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">📋 Treinos</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              ➕ Novo Treino
            </button>
            <button
              onClick={loadTreinos}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* 🔹 Filtro */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* 🔹 Tabela */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando treinos...</p>
        ) : filteredTreinos.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum treino cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTreinos.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => setEditModal(t)}
                  >
                    <td className="py-3 px-4">{t.id}</td>
                    <td className="py-3 px-4">{t.nome}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t.id);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔹 Modal Criar Treino */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="relative bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-lg border border-gray-700">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
              Criar Novo Treino
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome do treino"
                value={form.nome}
                onChange={(e) => setForm({ nome: e.target.value })}
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-all"
              >
                {submitting ? "Enviando..." : "Criar Treino"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal Editar Treino */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setEditModal(null)}
        >
          <div className="relative bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-lg border border-gray-700">
            <button
              onClick={() => setEditModal(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
              Editar Treino
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editModal.nome}
                onChange={(e) =>
                  setEditModal({ ...editModal, nome: e.target.value })
                }
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-all"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
