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
  List,
  Globe,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileVideo,
} from "lucide-react";
import {
  getExercicios,
  createExercicio,
  deleteExercicio,
  updateExercicio,
  getExerciciosPublicos,
} from "../../services/Treinador/ExerciciosService";

export default function ExercicioDashboard() {
  // --- STATES DA LISTA PRINCIPAL ---
  const [exercicios, setExercicios] = useState([]);
  const [filteredExercicios, setFilteredExercicios] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    categoria: "",
    grupo: "",
  });

  // --- STATES DE CRUD ---
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- STATES DA BIBLIOTECA PÚBLICA ---
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [publicExercicios, setPublicExercicios] = useState([]);
  const [filteredPublicExercicios, setFilteredPublicExercicios] = useState([]);
  const [publicFilters, setPublicFilters] = useState({
    search: "",
    categoria: "",
    grupo: "",
  });
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [importingId, setImportingId] = useState(null);

  // --- PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // --------------------------------

  // --- STATE: VISUALIZAÇÃO DETALHADA ---
  const [viewPublicModal, setViewPublicModal] = useState(null);
  // ------------------------------------------

  const [form, setForm] = useState({
    nome: "",
    Categoria: "",
    Grupo_Muscular: "",
    Descricao: "",
    Aparelho: "",
    file: null,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- LÓGICA DE DADOS PRINCIPAL ---

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

  // Filtragem da Lista Principal
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

  // --- LÓGICA DA BIBLIOTECA PÚBLICA ---

  const handleOpenPublicLibrary = async () => {
    setShowPublicModal(true);
    setLoadingPublic(true);
    setPublicFilters({ search: "", categoria: "", grupo: "" });
    setCurrentPage(1);
    try {
      const data = await getExerciciosPublicos();
      const arr = Array.isArray(data) ? data : [];
      setPublicExercicios(arr);
      setFilteredPublicExercicios(arr);
    } catch (error) {
      console.error("Erro ao buscar biblioteca pública", error);
      alert("Erro ao buscar exercícios públicos.");
    } finally {
      setLoadingPublic(false);
    }
  };

  // Filtragem da Lista Pública
  useEffect(() => {
    let filtered = publicExercicios;
    if (publicFilters.search) {
      filtered = filtered.filter((ex) =>
        ex.nome?.toLowerCase().includes(publicFilters.search.toLowerCase())
      );
    }
    if (publicFilters.categoria) {
      filtered = filtered.filter(
        (ex) => ex.Categoria === publicFilters.categoria
      );
    }
    if (publicFilters.grupo) {
      filtered = filtered.filter(
        (ex) => ex.Grupo_Muscular === publicFilters.grupo
      );
    }
    setFilteredPublicExercicios(filtered);
    setCurrentPage(1);
  }, [publicFilters, publicExercicios]);

  // IMPORTAÇÃO COM VÍDEO
  const handleImportExercicio = async (exPublico) => {
    setImportingId(exPublico.id);

    try {
      const fd = new FormData();

      fd.append("nome", exPublico.nome);
      fd.append("Categoria", exPublico.Categoria);
      fd.append("Grupo_Muscular", exPublico.Grupo_Muscular);
      fd.append("Descricao", exPublico.Descricao || "");
      fd.append("Aparelho", exPublico.Aparelho || "");

      // 👉 Envia APENAS a URL do vídeo (NÃO baixa no front)
      if (exPublico.videos?.[0]?.url) {
        fd.append("video_url", exPublico.videos[0].url);
      }

      await createExercicio(fd);
      await loadExercicios();

      alert(`Exercício "${exPublico.nome}" importado com sucesso!`);

      if (viewPublicModal?.id === exPublico.id) {
        setViewPublicModal(null);
      }
    } catch (err) {
      console.error("Erro na importação:", err);
      alert("Erro ao importar o exercício.");
    } finally {
      setImportingId(null);
    }
  };

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
      alert("Erro ao criar exercício.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await deleteExercicio(id);
      await loadExercicios();
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
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar exercício.");
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
  const publicCategorias = Array.from(
    new Set(publicExercicios.map((ex) => ex.Categoria).filter(Boolean))
  );
  const publicGrupos = Array.from(
    new Set(publicExercicios.map((ex) => ex.Grupo_Muscular).filter(Boolean))
  );

  // --- CÁLCULO DE PAGINAÇÃO (RENDER) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPublicItems = filteredPublicExercicios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPublicExercicios.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  // -------------------------------------

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-100">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Dumbbell size={32} className="text-blue-600" /> Biblioteca de
            Exercícios
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Plus size={20} /> Novo
            </button>
            <button
              onClick={handleOpenPublicLibrary}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-md active:scale-95"
            >
              <Globe size={20} /> Biblioteca Pública
            </button>
            <button
              onClick={loadExercicios}
              className={`flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition active:scale-95 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}{" "}
              {loading ? "Carregando..." : "Atualizar"}
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition active:scale-95"
            >
              <Filter size={20} /> Filtros
            </button>
          </div>
        </div>

        {/* FILTROS PRINCIPAIS */}
        <div className="hidden md:block">
          <FilterBar
            currentFilters={filters}
            setFilterState={setFilters}
            catOptions={categorias}
            grpOptions={grupos}
            placeholder="Buscar exercício por nome..."
          />
        </div>
        {isFilterOpen && (
          <div className="md:hidden bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 shadow-inner">
            <FilterBar
              currentFilters={filters}
              setFilterState={setFilters}
              catOptions={categorias}
              grpOptions={grupos}
              placeholder="Buscar exercício..."
            />
          </div>
        )}

        {/* LISTA PRINCIPAL */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={32} className="animate-spin mr-3 text-blue-500" />
            <p className="text-lg">Carregando biblioteca...</p>
          </div>
        ) : filteredExercicios.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            Nenhum exercício encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercicios.map((ex) => (
              <div
                key={ex.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 break-words max-w-[80%]">
                      {ex.nome}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditModal(ex);
                      }}
                      className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                    <List size={14} className="text-gray-400" />{" "}
                    {ex.Grupo_Muscular}
                  </p>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <Dumbbell size={14} className="text-gray-400" />{" "}
                    {ex.Aparelho || "Livre"}
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
                    className="text-red-600 hover:bg-red-50 p-1 rounded-md text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAIS CRUD (CRIAR/EDITAR) --- */}
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
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              className="w-full border p-2 rounded-xl"
            />
            <input
              type="text"
              placeholder="Categoria"
              value={form.Categoria}
              onChange={(e) => setForm({ ...form, Categoria: e.target.value })}
              required
              className="w-full border p-2 rounded-xl"
            />
            <input
              type="text"
              placeholder="Grupo Muscular"
              value={form.Grupo_Muscular}
              onChange={(e) =>
                setForm({ ...form, Grupo_Muscular: e.target.value })
              }
              required
              className="w-full border p-2 rounded-xl"
            />
            <input
              type="text"
              placeholder="Aparelho"
              value={form.Aparelho}
              onChange={(e) => setForm({ ...form, Aparelho: e.target.value })}
              className="w-full border p-2 rounded-xl"
            />
            <textarea
              placeholder="Descrição"
              value={form.Descricao}
              onChange={(e) => setForm({ ...form, Descricao: e.target.value })}
              className="w-full border p-2 rounded-xl"
            />

            {/* --- ÁREA DE UPLOAD COM DESTAQUE --- */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Vídeo de Demonstração
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="video-upload-new"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                />
                <label
                  htmlFor="video-upload-new"
                  className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 gap-2
                            ${
                              form.file
                                ? "border-green-400 bg-green-50 hover:bg-green-100"
                                : "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-500"
                            }`}
                >
                  {form.file ? (
                    <div className="flex flex-col items-center text-green-700 animate-in fade-in zoom-in duration-200">
                      <div className="bg-green-200 p-3 rounded-full mb-1">
                        <FileVideo size={28} className="text-green-800" />
                      </div>
                      <span className="font-semibold text-sm max-w-[250px] truncate">
                        {form.file.name}
                      </span>
                      <span className="text-xs text-green-600">
                        Clique para alterar o vídeo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-blue-600 group">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
                        <Upload size={24} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-sm">
                        Clique para adicionar vídeo
                      </span>
                      <span className="text-xs text-blue-400">
                        Formatos: MP4, MOV (Max. 10MB)
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* ----------------------------------- */}
          </div>
        </Modal>
      )}

      {editModal && (
        <Modal
          title={`Editando: ${editModal.nome}`}
          onClose={() => setEditModal(null)}
          onSubmit={handleUpdate}
          submitting={submitting}
          size="max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 items-start">
            <div className="md:sticky md:top-0">
              <VideoPreview editModal={editModal} setEditModal={setEditModal} />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={editModal.nome}
                onChange={(e) =>
                  setEditModal({ ...editModal, nome: e.target.value })
                }
                className="w-full border p-2 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Categoria"
                  value={editModal.Categoria}
                  onChange={(e) =>
                    setEditModal({ ...editModal, Categoria: e.target.value })
                  }
                  className="w-full border p-2 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Grupo"
                  value={editModal.Grupo_Muscular}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      Grupo_Muscular: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Aparelho"
                value={editModal.Aparelho || ""}
                onChange={(e) =>
                  setEditModal({ ...editModal, Aparelho: e.target.value })
                }
                className="w-full border p-2 rounded-xl"
              />
              <textarea
                rows={6}
                placeholder="Descrição"
                value={editModal.Descricao}
                onChange={(e) =>
                  setEditModal({ ...editModal, Descricao: e.target.value })
                }
                className="w-full border p-2 rounded-xl resize-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL DA BIBLIOTECA PÚBLICA (LISTAGEM) --- */}
      {showPublicModal && (
        <Modal
          title="Importar da Biblioteca Pública"
          onClose={() => setShowPublicModal(false)}
          onSubmit={(e) => e.preventDefault()}
          submitting={false}
          size="max-w-7xl"
          showFooter={false}
        >
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Filtrar Exercícios Públicos
            </h3>
            <FilterBar
              currentFilters={publicFilters}
              setFilterState={setPublicFilters}
              catOptions={publicCategorias}
              grpOptions={publicGrupos}
              placeholder="Pesquisar na biblioteca pública..."
            />
          </div>

          {loadingPublic ? (
            <div className="flex justify-center items-center py-20">
              <Loader2
                size={32}
                className="animate-spin mr-3 text-purple-600"
              />
              <p className="text-gray-500">Buscando exercícios online...</p>
            </div>
          ) : filteredPublicExercicios.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Nenhum exercício encontrado.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentPublicItems.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-purple-100 transition flex flex-col justify-between h-full group"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => setViewPublicModal(ex)}
                    >
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-purple-600 transition">
                        {ex.nome}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        <span className="bg-gray-100 border px-2 py-1 rounded">
                          {ex.Categoria}
                        </span>
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded">
                          {ex.Grupo_Muscular}
                        </span>
                      </div>

                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 relative group/video">
                        {ex.videos?.[0]?.url ? (
                          <>
                            <video
                              src={ex.videos[0].url}
                              className="w-full h-full object-cover opacity-80 group-hover/video:opacity-60 transition"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm group-hover/video:scale-110 transition">
                                <Eye size={24} className="text-white" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300">
                            <Eye size={24} className="mb-1 opacity-50" />
                            Visualizar Detalhes
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setViewPublicModal(ex)}
                        className="flex-1 py-2.5 rounded-xl font-medium text-sm flex justify-center items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        <Eye size={16} /> Ver
                      </button>

                      <button
                        type="button"
                        onClick={() => handleImportExercicio(ex)}
                        disabled={importingId === ex.id}
                        className={`flex-[2] py-2.5 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 transition-all ${
                          importingId === ex.id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95"
                        }`}
                      >
                        {importingId === ex.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        {importingId === ex.id ? "Importando..." : "Importar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- CONTROLES DE PAGINAÇÃO --- */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    Página{" "}
                    <span className="text-purple-600 font-bold">
                      {currentPage}
                    </span>{" "}
                    de {totalPages}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </Modal>
      )}

      {/* --- NOVO MODAL (MODAL 2): VISUALIZAÇÃO DETALHADA PÚBLICA --- */}
      {viewPublicModal && (
        <Modal
          title={viewPublicModal.nome}
          onClose={() => setViewPublicModal(null)}
          onSubmit={(e) => e.preventDefault()}
          submitting={false}
          size="max-w-4xl"
          showFooter={false} // Remover o rodapé com botão salvar
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
            <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-lg flex items-center justify-center relative">
              {viewPublicModal.videos?.[0]?.url ? (
                <video
                  src={viewPublicModal.videos[0].url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-white flex flex-col items-center gap-3">
                  <Video size={48} className="opacity-50" />
                  <span>Sem vídeo disponível</span>
                </div>
              )}
            </div>

            <div className="flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Dados Técnicos
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                      {viewPublicModal.Categoria}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                      {viewPublicModal.Grupo_Muscular}
                    </span>
                    {viewPublicModal.Aparelho && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                        {viewPublicModal.Aparelho}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Descrição / Execução
                  </span>
                  <div className="mt-2 text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-[200px] overflow-y-auto">
                    {viewPublicModal.Descricao || "Sem descrição informada."}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleImportExercicio(viewPublicModal)}
                  disabled={importingId === viewPublicModal.id}
                  className={`w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all shadow-lg ${
                    importingId === viewPublicModal.id
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform active:scale-95"
                  }`}
                >
                  {importingId === viewPublicModal.id ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Download size={24} />
                  )}
                  {importingId === viewPublicModal.id
                    ? "Importando..."
                    : "Importar Agora"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- COMPONENTE FILTER BAR (MOVIDO PARA FORA DO EXERCICIODASHBOARD) ---
const FilterBar = ({
  currentFilters,
  setFilterState,
  catOptions,
  grpOptions,
  placeholder,
}) => (
  <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={currentFilters.search}
        onChange={(e) =>
          setFilterState({ ...currentFilters, search: e.target.value })
        }
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
    </div>
    <select
      value={currentFilters.categoria}
      onChange={(e) =>
        setFilterState({ ...currentFilters, categoria: e.target.value })
      }
      className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    >
      <option value="">Todas as Categorias</option>
      {catOptions.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
    <select
      value={currentFilters.grupo}
      onChange={(e) =>
        setFilterState({ ...currentFilters, grupo: e.target.value })
      }
      className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
    >
      <option value="">Todos os Grupos</option>
      {grpOptions.map((grp) => (
        <option key={grp} value={grp}>
          {grp}
        </option>
      ))}
    </select>
  </div>
);

// Componente Modal Reutilizável com prop showFooter
const Modal = ({
  title,
  onClose,
  onSubmit,
  children,
  submitting,
  size = "max-w-lg",
  showFooter = true,
}) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className={`relative bg-white rounded-2xl shadow-2xl flex flex-col w-full ${size}`}
      style={{ maxHeight: "90vh" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
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

      {showFooter && (
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
      )}
    </div>
  </div>
);

const VideoPreview = ({ editModal, setEditModal }) => {
  const videoSrc = editModal.newFile
    ? URL.createObjectURL(editModal.newFile)
    : editModal.videos?.[0]?.url;
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-full flex flex-col">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Video size={18} className="text-blue-500" /> Vídeo
      </h3>
      <div className="w-full flex justify-center mb-4 bg-black/5 rounded-xl min-h-[300px] items-center">
        {videoSrc ? (
          <video
            controls
            className="max-h-[500px] w-auto h-auto object-contain rounded-lg"
            src={videoSrc}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Video size={32} /> Nenhum vídeo
          </div>
        )}
      </div>
      <label className="cursor-pointer w-full text-center px-4 py-3 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-500 transition shadow-sm">
        {editModal.videos?.[0]?.url ? "Substituir Vídeo" : "Adicionar Vídeo"}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files[0])
              setEditModal({ ...editModal, newFile: e.target.files[0] });
          }}
          className="hidden"
        />
      </label>
    </div>
  );
};
