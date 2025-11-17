// src/pages/Dietas/DietaDashboard.jsx

import { useEffect, useState } from "react";
import {
  createDieta,
  getDietas,
  deleteDieta,
} from "../../services/Treinador/DietasService";

export default function DietaDashboard() {
  const [dietas, setDietas] = useState([]);
  const [filteredDietas, setFilteredDietas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);

  const [form, setForm] = useState({
    descricao: "",
    file: null,
  });

  const [filters, setFilters] = useState({
    search: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDietas();
  }, []);

  const loadDietas = async () => {
    setLoading(true);
    try {
      const data = await getDietas();
      console.log("Dietas carregadas:", data);
      const arr = Array.isArray(data) ? data : [];
      setDietas(arr);
      setFilteredDietas(arr);
    } catch (err) {
      console.error("Erro ao carregar dietas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtro por busca
  useEffect(() => {
    let filtered = dietas;

    if (filters.search) {
      filtered = filtered.filter((d) =>
        d.descricao?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredDietas(filtered);
  }, [filters, dietas]);

  // Criar dieta
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!form.file) {
        alert("Selecione um arquivo para enviar.");
        return;
      }

      await createDieta(form.file, form.descricao);

      setShowModal(false);
      await loadDietas();

      setForm({
        descricao: "",
        file: null,
      });
    } catch (err) {
      console.error("Erro ao criar dieta:", err);
      alert("Erro ao criar dieta. Verifique o console.");
    } finally {
      setSubmitting(false);
    }
  };

  // Excluir dieta
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta dieta?")) return;

    try {
      await deleteDieta(id);
      await loadDietas();
    } catch (err) {
      console.error("Erro ao excluir dieta:", err);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🥗 Dietas</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              ➕ Nova Dieta
            </button>
            <button
              onClick={loadDietas}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-center text-gray-500">Carregando dietas...</p>
        ) : filteredDietas.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma dieta cadastrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDietas.map((dieta) => (
              <div
                key={dieta.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setViewModal(dieta)}
              >
                <h3 className="font-semibold text-gray-800 mb-1">
                  {dieta.descricao}
                </h3>

                {dieta.filename && (
                  <p className="text-gray-500 text-sm">
                    Arquivo: {dieta.filename}
                  </p>
                )}
                {console.log(dieta)}
                <button
                  className="text-red-600 hover:underline text-sm mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(dieta.id);
                  }}
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de criar dieta */}
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

            <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
              Criar Nova Dieta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Descrição da dieta"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white resize-none"
              />

              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files[0] })
                }
                required
                className="w-full border border-gray-700 rounded-xl px-4 py-2 bg-gray-800 text-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition-all"
              >
                {submitting ? "Enviando..." : "Criar Dieta"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualizar dieta */}
      {viewModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setViewModal(null)}
        >
          <div className="relative bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-xl border border-gray-700 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setViewModal(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
              Detalhes da Dieta
            </h2>

            <p className="mb-4 text-gray-300">{viewModal.descricao}</p>

            {viewModal.url && (
              <a
                href={`http://${viewModal.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                📄 Abrir arquivo
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
