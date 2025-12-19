import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Salad,
  FileText,
  ExternalLink,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Eye, // <--- Importei o ícone de Olho
} from "lucide-react";
import {
  createDieta,
  getDietas,
  deleteDieta,
} from "../../services/Treinador/DietasService";

// --- COMPONENTE DE NOTIFICAÇÃO (TOAST) ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon =
    type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />;

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColors} text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50`}
    >
      {icon}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// --- COMPONENTE CARD DE DIETA ---
const DietaCard = ({ dieta, onView, onDelete }) => (
  <div
    onClick={() => onView(dieta)}
    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
        <Salad size={24} />
      </div>

      {/* AÇÕES RÁPIDAS (NOVO BOTÃO DE VISUALIZAR) */}
      <div className="flex gap-1">
        {dieta.url && (
          <a
            href={`${dieta.url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Impede abrir o modal de detalhes
            className="text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
            title="Visualizar PDF"
          >
            <Eye size={18} />
          </a>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(dieta.id);
          }}
          className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Excluir Dieta"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    <div>
      <h3
        className="font-bold text-gray-800 text-lg mb-1 line-clamp-1"
        title={dieta.descricao}
      >
        {dieta.descricao}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <FileText size={14} />
        <span className="truncate max-w-[200px]">
          {dieta.filename || "Arquivo anexado"}
        </span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
      <span className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:underline">
        Ver detalhes
      </span>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function DietaDashboard() {
  const [dietas, setDietas] = useState([]);
  const [filteredDietas, setFilteredDietas] = useState([]);

  // Estados de Controle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Formulário
  const [form, setForm] = useState({ descricao: "", file: null });
  const [fileNamePreview, setFileNamePreview] = useState("");

  // Filtros
  const [search, setSearch] = useState("");

  const showToast = (message, type = "success") => setToast({ message, type });

  // --- CARREGAMENTO DE DADOS ---
  const loadDietas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDietas();
      const arr = Array.isArray(data) ? data : [];
      setDietas(arr);
      setFilteredDietas(arr);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar dietas.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDietas();
  }, [loadDietas]);

  // --- FILTRAGEM ---
  useEffect(() => {
    if (!search) {
      setFilteredDietas(dietas);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredDietas(
        dietas.filter((d) => d.descricao?.toLowerCase().includes(lowerSearch))
      );
    }
  }, [search, dietas]);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file });
      setFileNamePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      showToast("Por favor, selecione um arquivo.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await createDieta(form.file, form.descricao);
      showToast("Dieta cadastrada com sucesso!");
      setIsModalOpen(false);
      setForm({ descricao: "", file: null });
      setFileNamePreview("");
      loadDietas();
    } catch (err) {
      console.error(err);
      showToast("Erro ao criar dieta.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta dieta?")) return;
    try {
      await deleteDieta(id);
      showToast("Dieta removida.");
      loadDietas();
    } catch (err) {
      showToast("Erro ao excluir.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-900">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <span className="bg-green-100 text-green-600 p-2 rounded-lg">
                <Salad size={28} />
              </span>
              Gestão de Dietas
            </h1>
            <p className="text-gray-500 mt-2 ml-1">
              Organize os planos alimentares e arquivos.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-green-200 transition-all active:scale-95"
            >
              <Plus size={20} /> Nova Dieta
            </button>
            <button
              onClick={loadDietas}
              className="p-3 rounded-xl border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              title="Atualizar lista"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar dieta por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* LISTA DE CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredDietas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Salad size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">
              Nenhum plano alimentar encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDietas.map((dieta) => (
              <DietaCard
                key={dieta.id}
                dieta={dieta}
                onView={setViewModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL DE CRIAÇÃO --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-in fade-in zoom-in duration-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
              Cadastrar Nova Dieta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Plano
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Dieta Hipertrofia - Fase 1"
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arquivo (PDF ou Imagem)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-300 transition group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud
                      size={32}
                      className="text-gray-400 group-hover:text-green-500 mb-2 transition-colors"
                    />
                    <p className="text-sm text-gray-500 group-hover:text-green-600 font-medium">
                      {fileNamePreview
                        ? fileNamePreview
                        : "Clique para selecionar o arquivo"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Salvar Dieta"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE VISUALIZAÇÃO --- */}
      {viewModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setViewModal(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200 relative text-center">
            <button
              onClick={() => setViewModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {viewModal.descricao}
            </h3>
            <p className="text-gray-500 text-sm mb-6 bg-gray-50 py-2 rounded-lg border border-gray-100 truncate px-4">
              Arquivo: {viewModal.filename || "Sem nome"}
            </p>

            {/* BOTÃO PRINCIPAL DE VISUALIZAR NO MODAL */}
            {viewModal.url ? (
              <a
                href={`${viewModal.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
              >
                <Eye size={20} /> Visualizar PDF / Arquivo
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle size={16} /> URL do arquivo indisponível.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
