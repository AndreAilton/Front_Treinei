import { useEffect, useState } from "react";
import {
  getExercicios,
  createExercicio,
  deleteExercicio,
  updateExercicio,
} from "../../services/ExerciciosService";

export default function ExercicioDashboard() {
  const [exercicios, setExercicios] = useState([]);
  const [filteredExercicios, setFilteredExercicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    Categoria: "",
    Grupo_Muscular: "",
    Descricao: "",
    Aparelho: "",
    file: null,
  });
  const [filters, setFilters] = useState({
    search: "",
    categoria: "",
    grupo: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadExercicios();
  }, []);

  const loadExercicios = async () => {
    setLoading(true);
    try {
      const data = await getExercicios();
      const arr = Array.isArray(data) ? data : [];
      setExercicios(arr);
      setFilteredExercicios(arr);
    } catch (err) {
      console.error("Erro ao carregar exercícios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = exercicios;

    if (filters.search) {
      filtered = filtered.filter((ex) =>
        ex.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.categoria) {
      filtered = filtered.filter((ex) => ex.Categoria === filters.categoria);
    }
    if (filters.grupo) {
      filtered = filtered.filter((ex) => ex.Grupo_Muscular === filters.grupo);
    }

    setFilteredExercicios(filtered);
  }, [filters, exercicios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("nome", form.nome);
      fd.append("Categoria", form.Categoria);
      fd.append("Grupo_Muscular", form.Grupo_Muscular);
      fd.append("Descricao", form.Descricao);
      fd.append("Aparelho", form.Aparelho);
      if (form.file) fd.append("file", form.file);

      await createExercicio(fd);
      setShowModal(false);
      await loadExercicios();

      setForm({
        nome: "",
        Categoria: "",
        Grupo_Muscular: "",
        Descricao: "",
        Aparelho: "",
        file: null,
      });
    } catch (err) {
      console.error("Erro ao criar exercício:", err);
      alert("Erro ao criar exercício. Veja o console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este exercício?")) return;
    try {
      await deleteExercicio(id);
      await loadExercicios();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateExercicio(editModal.id, editModal);
      setEditModal(null);
      await loadExercicios();
    } catch (err) {
      console.error("Erro ao atualizar exercício:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🏋️ Exercícios</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              ➕ Novo Exercício
            </button>
            <button
              onClick={loadExercicios}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* 🔹 Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <select
            value={filters.categoria}
            onChange={(e) =>
              setFilters({ ...filters, categoria: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Todas as Categorias</option>
            <option value="Peito">Peito</option>
            <option value="Costas">Costas</option>
            <option value="Perna">Perna</option>
            <option value="Braço">Braço</option>
          </select>

          <select
            value={filters.grupo}
            onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Todos os Grupos</option>
            <option value="Peitoral">Peitoral</option>
            <option value="Dorsal">Dorsal</option>
            <option value="Quadríceps">Quadríceps</option>
            <option value="Bíceps">Bíceps</option>
          </select>
        </div>

{/* 🔹 Tabela */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando exercícios...</p>
        ) : filteredExercicios.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum exercício cadastrado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Categoria</th>
                  <th className="py-3 px-4 text-left">Grupo Muscular</th>
                  <th className="py-3 px-4 text-left">Aparelho</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercicios.map((ex) => (
                  <tr
                    key={ex.id}
                    className="border-b hover:bg-blue-50 cursor-pointer transition-all"
                    onClick={() => setEditModal(ex)}
                  >
                    <td className="py-3 px-4">{ex.nome}</td>
                    <td className="py-3 px-4">{ex.Categoria}</td>
                    <td className="py-3 px-4">{ex.Grupo_Muscular}</td>
                    <td className="py-3 px-4">{ex.Aparelho}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ex.id);
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

      {/* 🔹 Modal de Criação */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="relative bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-lg border border-gray-700 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
              Criar Novo Exercício
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={form.Categoria}
                onChange={(e) => setForm({ ...form, Categoria: e.target.value })}
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Grupo Muscular"
                value={form.Grupo_Muscular}
                onChange={(e) => setForm({ ...form, Grupo_Muscular: e.target.value })}
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                placeholder="Aparelho"
                value={form.Aparelho}
                onChange={(e) => setForm({ ...form, Aparelho: e.target.value })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <textarea
                placeholder="Descrição"
                value={form.Descricao}
                onChange={(e) => setForm({ ...form, Descricao: e.target.value })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white resize-none"
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-all"
              >
                {submitting ? "Enviando..." : "Criar Exercício"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal de Edição e Vídeo */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setEditModal(null)}
        >
          <div className="relative bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-gray-700 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setEditModal(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
              Editar Exercício
            </h2>

            {editModal.videos?.[0]?.url && (
              <video
                controls
                className="w-full rounded-xl mb-4 border border-gray-700"
                src={`http://${editModal.videos[0].url}`}
              />
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editModal.nome}
                onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                value={editModal.Categoria}
                onChange={(e) => setEditModal({ ...editModal, Categoria: e.target.value })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <input
                type="text"
                value={editModal.Grupo_Muscular}
                onChange={(e) =>
                  setEditModal({ ...editModal, Grupo_Muscular: e.target.value })
                }
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />
              <textarea
                value={editModal.Descricao}
                onChange={(e) => setEditModal({ ...editModal, Descricao: e.target.value })}
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white resize-none"
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
