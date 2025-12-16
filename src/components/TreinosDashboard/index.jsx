import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  X,
  Edit3,
  Trash2,
  List,
  Copy, // Ícone para duplicar
  Loader2,
} from "lucide-react";

import {
  getTreinos,
  createTreino,
  deleteTreino,
  updateTreino,
  duplicarTreino,
} from "../../services/Treinador/TreinosService"; // Assuma que o path está correto

export default function TreinoDashboard() {
  const [treinos, setTreinos] = useState([]);
  const [filteredTreinos, setFilteredTreinos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({ nome: "" });
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- LÓGICA DE DADOS ---

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
      alert("Não foi possível carregar a lista de treinos.");
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

  // --- HANDLERS CRUD ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTreino({ nome: form.nome });
      setShowModal(false);
      await loadTreinos();
      alert("Treino criado com sucesso!");
      setForm({ nome: "" });
    } catch (err) {
      console.error("Erro ao criar treino:", err);
      alert("Erro ao criar treino. Veja o console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ATENÇÃO: Tem certeza que deseja excluir este treino? Esta ação é irreversível.")) 
      return;
    try {
      await deleteTreino(id);
      await loadTreinos();
      alert("Treino excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o treino.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateTreino(editModal.id, { nome: editModal.nome }); // Enviando apenas o nome, assumindo que é o único campo editável.
      setEditModal(null);
      await loadTreinos();
      alert("Treino atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar treino:", err);
      alert("Erro ao atualizar treino.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = async (id) => {
    if (!window.confirm("Deseja duplicar este treino? Uma cópia será criada.")) return;

    try {
      await duplicarTreino(id);
      await loadTreinos();
      alert("Treino duplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao duplicar treino:", error);
      alert("Erro ao duplicar treino. Tente novamente.");
    }
  };

  // --- RENDERIZAÇÃO ---

  const renderTable = () => (
    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider hidden sm:table-cell">ID</th>
            <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">Nome do Treino</th>
            <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredTreinos.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-blue-50 transition-all group"
            >
              <td className="py-3 px-6 text-sm text-gray-500 hidden sm:table-cell">{t.id}</td>
              <td className="py-3 px-6 text-sm font-medium text-gray-900">
                <span className="cursor-pointer hover:text-blue-600 transition" onClick={() => setEditModal(t)}>
                    {t.nome}
                </span>
              </td>

              <td className="py-3 px-6 text-center">
                <div className="flex justify-center space-x-4">
                  
                  {/* Botão Clonar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(t.id);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                    title="Duplicar Treino"
                  >
                    <Copy size={18} />
                  </button>
                  
                  {/* Botão Editar (Abre o modal, mas evitamos o clique da linha) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditModal(t);
                    }}
                    className="text-gray-500 hover:text-orange-600 p-2 rounded-full hover:bg-orange-100 transition"
                    title="Editar Nome"
                  >
                    <Edit3 size={18} />
                  </button>

                  {/* Botão Excluir */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(t.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                    title="Excluir Treino"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreinos.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between">
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <List size={20} className="text-blue-600"/> {t.nome}
                </h3>
                
                <p className="text-xs text-gray-500 mb-4">ID: {t.id}</p>

                <div className="flex justify-start space-x-3 border-t pt-3 border-gray-100">
                     {/* Botão Clonar */}
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(t.id);
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg transition"
                        title="Duplicar Treino"
                    >
                        <Copy size={16} /> Clonar
                    </button>
                    
                    {/* Botão Editar */}
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setEditModal(t);
                        }}
                        className="flex items-center gap-1 text-sm text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-lg transition"
                        title="Editar Nome"
                    >
                        <Edit3 size={16} /> Editar
                    </button>

                    {/* Botão Excluir */}
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                        }}
                        className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg transition"
                        title="Excluir Treino"
                    >
                        <Trash2 size={16} /> Excluir
                    </button>
                </div>
            </div>
        ))}
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        
        {/* HEADER E BOTÕES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <List size={32} className="text-blue-600"/> Meus Treinos
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} /> Novo Treino
            </button>
            <button
              onClick={loadTreinos}
              className={`flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              Atualizar
            </button>
          </div>
        </div>

        {/* FILTRO DE BUSCA */}
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Buscar treino por nome..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            />
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={32} className="animate-spin mr-3 text-blue-500" />
            <p className="text-lg">Carregando lista de treinos...</p>
          </div>
        ) : filteredTreinos.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            Nenhum treino cadastrado ou encontrado.
          </p>
        ) : (
          // Usando Cards para melhor visualização em listas de treinos menores,
          // mantendo a responsividade superior em todas as telas.
          // Se fosse necessário gerenciar centenas de treinos, a tabela seria melhor.
          renderCardList()
          // Você pode alternar para renderTable() se a preferência for por tabelas tradicionais
        )}
      </div>

      {/* --- MODAL CRIAR TREINO --- */}
      {showModal && (
        <Modal 
          title="Criar Novo Treino"
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do treino (Ex: Treino A - Peito e Tríceps)"
              value={form.nome}
              onChange={(e) => setForm({ nome: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </Modal>
      )}

      {/* --- MODAL EDITAR TREINO --- */}
      {editModal && (
        <Modal 
          title={`Editar Treino: ${editModal.nome}`}
          onClose={() => setEditModal(null)}
          onSubmit={handleUpdate}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Novo nome do treino"
              value={editModal.nome}
              onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <p className="text-sm text-gray-500">
                Se você precisa duplicar ou excluir, use os botões na lista de treinos.
            </p>
          </div>
        </Modal>
      )}

    </div>
  );
}

// Componente Modal Reutilizável
const Modal = ({ title, onClose, onSubmit, children, submitting, size = 'max-w-lg' }) => (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full ${size}`}
        style={{ maxHeight: '95vh', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          {title}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(95vh - 100px)' }}>
          {children}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
);