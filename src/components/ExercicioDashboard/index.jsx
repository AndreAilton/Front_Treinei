import React, { useEffect, useState } from "react";
import { 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  X, 
  Edit3, 
  Trash2, 
  Dumbbell,
  Video,
  Loader2,
  List
} from "lucide-react";
import {
  getExercicios,
  createExercicio,
  deleteExercicio,
  updateExercicio,
} from "../../services/Treinador/ExerciciosService"; 

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
  const [isFilterOpen, setIsFilterOpen] = useState(false); 

  // --- LÓGICA DE DADOS ---

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
      alert("Não foi possível carregar os exercícios."); 
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

  // --- HANDLERS CRUD ---

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
      alert("Exercício criado com sucesso!");

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
      alert("Erro ao criar exercício. Verifique o console ou tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este exercício? Esta ação é irreversível."))
      return;
    try {
      await deleteExercicio(id);
      await loadExercicios();
      alert("Exercício excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir o exercício.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true); 
    try {
      const fd = new FormData();
      fd.append("nome", editModal.nome);
      fd.append("Categoria", editModal.Categoria);
      fd.append("Grupo_Muscular", editModal.Grupo_Muscular);
      fd.append("Descricao", editModal.Descricao);
      fd.append("Aparelho", editModal.Aparelho || ""); 
      
      if (editModal.newFile) {
        fd.append("file", editModal.newFile);
      }

      await updateExercicio(editModal.id, fd);
      setEditModal(null);
      await loadExercicios();
      alert("Exercício atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar exercício:", err);
      alert("Erro ao atualizar exercício. Verifique o console.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- DADOS PARA FILTROS ---

  const categorias = Array.from(
    new Set(exercicios.map((ex) => ex.Categoria).filter(Boolean))
  );
  const grupos = Array.from(
    new Set(exercicios.map((ex) => ex.Grupo_Muscular).filter(Boolean))
  );

  // --- RENDERIZAÇÃO ---

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="relative flex-grow min-w-[200px] md:min-w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar exercício por nome..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
        />
      </div>

      {categorias.length > 0 && (
        <select
          value={filters.categoria}
          onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
          className="flex-grow min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
        >
          <option value="">Todas as Categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}

      {grupos.length > 0 && (
        <select
          value={filters.grupo}
          onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
          className="flex-grow min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
        >
          <option value="">Todos os Grupos</option>
          {grupos.map((grp) => (
            <option key={grp} value={grp}>
              {grp}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  const renderExerciseCard = (ex) => (
    <div
      key={ex.id}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl hover:ring-2 hover:ring-blue-100 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-lg text-gray-800 break-words max-w-[80%]">
             {ex.nome}
           </h3>
           <button
             onClick={(e) => {
               e.stopPropagation(); 
               setEditModal(ex);
             }}
             className="text-gray-400 hover:text-blue-500 transition p-1 rounded-full hover:bg-gray-100 shrink-0"
             aria-label={`Editar ${ex.nome}`}
           >
             <Edit3 size={18} />
           </button>
        </div>
        
        <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
          <List size={14} className="text-gray-400" />
          <span className="font-semibold">{ex.Grupo_Muscular}</span>
        </p>
        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
          <Dumbbell size={14} className="text-gray-400" />
          {ex.Aparelho || "Livre/Diversos"}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        {ex.videos?.[0]?.url ? (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <Video size={14} /> Vídeo Anexado
          </span>
        ) : (
          <span className="text-xs text-orange-600 font-medium flex items-center gap-1">
            <Video size={14} /> Sem Vídeo
          </span>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(ex.id);
          }}
          className="text-red-600 hover:bg-red-50 p-1 rounded-md text-sm transition"
          aria-label={`Excluir ${ex.nome}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        
        {/* HEADER E BOTÕES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Dumbbell size={32} className="text-blue-600"/> Biblioteca de Exercícios
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} /> Novo
            </button>
            <button
              onClick={loadExercicios}
              className={`flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              {loading ? "Carregando..." : "Atualizar"}
            </button>

            {/* Botão de Filtro Mobile */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition active:scale-95"
            >
              <Filter size={20} /> Filtros
            </button>
          </div>
        </div>

        {/* FILTROS (MOBILE e DESKTOP) */}
        <div className="hidden md:block">
          {renderFilters()}
        </div>
        
        {/* FILTROS MOBILE DROPDOWN */}
        {isFilterOpen && (
          <div className="md:hidden bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-inner animate-in slide-in-from-top-4 duration-200">
            {renderFilters()}
          </div>
        )}


        {/* CONTEÚDO PRINCIPAL */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={32} className="animate-spin mr-3 text-blue-500" />
            <p className="text-lg">Carregando biblioteca...</p>
          </div>
        ) : filteredExercicios.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            Nenhum exercício encontrado com os filtros aplicados.
          </p>
        ) : (
          <div className="space-y-10">
            {categorias.map((categoria) => {
              const exerciciosCategoria = filteredExercicios.filter(
                (ex) => ex.Categoria === categoria
              );
              if (exerciciosCategoria.length === 0) return null;

              return (
                <div key={categoria}>
                  <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-6">
                    {categoria}
                    <span className="text-base text-gray-400 font-normal ml-2">({exerciciosCategoria.length} itens)</span>
                  </h2>

                  {/* Visualização em Grid Responsiva (Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {exerciciosCategoria.map(renderExerciseCard)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MODAL CRIAR EXERCÍCIO --- */}
      {showModal && (
        <Modal 
          title="Adicionar Novo Exercício"
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Exercício"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Categoria (Ex: Força, Cardio, Flexibilidade)"
              value={form.Categoria}
              onChange={(e) => setForm({ ...form, Categoria: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Grupo Muscular Principal (Ex: Peito, Pernas, Abdômen)"
              value={form.Grupo_Muscular}
              onChange={(e) => setForm({ ...form, Grupo_Muscular: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <input
              type="text"
              placeholder="Aparelho/Equipamento (Opcional)"
              value={form.Aparelho}
              onChange={(e) => setForm({ ...form, Aparelho: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <textarea
              placeholder="Descrição ou Notas de Execução"
              rows={3}
              value={form.Descricao}
              onChange={(e) => setForm({ ...form, Descricao: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 resize-none focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <label className="block text-sm font-medium text-gray-700">Vídeo de Demonstração (Max. 10MB)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </div>
        </Modal>
      )}

      {/* --- MODAL EDITAR EXERCÍCIO (LAYOUT ALTERADO) --- */}
      {editModal && (
        <Modal 
          title={`Editando: ${editModal.nome}`}
          onClose={() => setEditModal(null)}
          onSubmit={handleUpdate}
          submitting={submitting}
          size="max-w-5xl" // Aumentado o tamanho máximo do modal
        >
          {/* Grid de Layout: 1 coluna no mobile, 2 colunas no desktop */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 items-start">
            
            {/* Coluna da Esquerda: Vídeo */}
            <div className="md:sticky md:top-0">
               <VideoPreview editModal={editModal} setEditModal={setEditModal} />
            </div>

            {/* Coluna da Direita: Formulário */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do Exercício"
                value={editModal.nome}
                onChange={(e) => setEditModal({ ...editModal, nome: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Categoria"
                    value={editModal.Categoria}
                    onChange={(e) => setEditModal({ ...editModal, Categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <input
                    type="text"
                    placeholder="Grupo Muscular"
                    value={editModal.Grupo_Muscular}
                    onChange={(e) => setEditModal({ ...editModal, Grupo_Muscular: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
              </div>
              <input
                type="text"
                placeholder="Aparelho/Equipamento"
                value={editModal.Aparelho || ""}
                onChange={(e) => setEditModal({ ...editModal, Aparelho: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <textarea
                rows={6} // Aumentado o espaço para descrição
                placeholder="Descrição"
                value={editModal.Descricao}
                onChange={(e) => setEditModal({ ...editModal, Descricao: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-900 resize-none focus:ring-blue-500 focus:border-blue-500 transition"
              />
              
              <button
                onClick={() => handleDelete(editModal.id)}
                type="button"
                className="w-full flex justify-center items-center gap-2 text-red-600 border border-red-300 py-2 rounded-xl hover:bg-red-50 transition-all text-sm mt-6"
              >
                <Trash2 size={16} /> Excluir Exercício
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}


// Componente Modal Reutilizável
const Modal = ({ title, onClose, onSubmit, children, submitting, size = 'max-w-lg' }) => (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl flex flex-col w-full ${size}`}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
             <h2 className="text-xl md:text-2xl font-bold text-gray-800">
               {title}
             </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <form id="modal-form" onSubmit={onSubmit} className="h-full">
                {children}
            </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              type="submit"
              form="modal-form"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-200"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
        </div>
      </div>
    </div>
);


// Componente de Preview de Vídeo (Para o Modal de Edição)
const VideoPreview = ({ editModal, setEditModal }) => {
    // Determina a URL do vídeo a ser exibido
    const videoSrc = editModal.newFile 
      ? URL.createObjectURL(editModal.newFile) // Novo vídeo
      : editModal.videos?.[0]?.url 
        ? `https://${editModal.videos[0].url}` // Vídeo existente (assumindo https:// é necessário)
        : null; // Nenhum vídeo

    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-full flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Video size={18} className="text-blue-500" /> Vídeo de Demonstração
            </h3>

            <div className="w-full flex justify-center mb-4 flex-grow bg-black/5 rounded-xl min-h-[300px] items-center">
                {videoSrc ? (
                    <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-xl shadow-inner">
                        <video
                            controls
                            className="max-h-[500px] w-auto h-auto object-contain rounded-lg" // Alterado para object-contain e controle de altura máxima
                            src={videoSrc}
                            key={videoSrc} // Força a re-renderização se o src mudar
                        />
                    </div>
                ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center w-full h-[300px]">
                        <span className="text-gray-500 text-sm flex flex-col items-center gap-2">
                             <Video size={32} className="opacity-20"/>
                             Nenhum vídeo vinculado
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center mt-auto">
                <label className="cursor-pointer w-full text-center px-4 py-3 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition shadow-sm">
                    {editModal.videos?.[0]?.url ? "Substituir Vídeo" : "Adicionar Vídeo"}
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setEditModal({ ...editModal, newFile: file });
                            }
                        }}
                        className="hidden"
                    />
                </label>
                {editModal.newFile && (
                    <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded-md">
                        Novo arquivo selecionado.
                    </p>
                )}
            </div>
        </div>
    );
};