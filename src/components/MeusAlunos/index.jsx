import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Dumbbell,
  Apple,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  X,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getTreinoUsuarios,
  updateTreinoUsuario,
  deleteTreinoTreinadorbyTreinador,
} from "../../services/Usuario/TreinoUsuarioService";

import { getdadosTreinador } from "../../services/Treinador/treinadorService";
import { getTreinos } from "../../services/Treinador/TreinosService";
import { getDietas } from "../../services/Treinador/DietasService";


// ------------------------------------------------------------------
// 📚 SUB-COMPONENTE: UserCard
// ------------------------------------------------------------------
const UserCard = ({ u, onDoubleClick }) => {
  const isTreinoActive = u.treino_ativo;
  const statusColor = isTreinoActive ? "text-green-600" : "text-red-600";
  const statusIcon = isTreinoActive ? CheckCircle : XCircle;

  return (
    <div
      key={u.id}
      onDoubleClick={() => onDoubleClick(u)}
      className="w-full sm:w-[300px] cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg hover:border-blue-400 transition-all active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-2 border-b pb-2">
        <h3 className="font-bold text-lg text-gray-800 truncate">
          {u.usuario?.nome || "Usuário Desconhecido"}
        </h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${isTreinoActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <span className="sr-only">{isTreinoActive ? "Ativo" : "Inativo"}</span>
          {statusIcon && <statusIcon size={14} />}
        </span>
      </div>

      <div className="text-sm space-y-1">
        <p className="text-gray-600 flex items-center gap-2">
          <Mail size={14} className="text-blue-500" />
          <span className="truncate">{u.usuario?.email || "N/A"}</span>
        </p>

        <p className="text-gray-600 flex items-center gap-2">
          <Phone size={14} className="text-blue-500" />
          <span className="truncate">{u.usuario?.telefone || "N/A"}</span>
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
        {u.treino && (
          <p className="text-blue-600 text-sm font-medium flex items-center gap-2">
            <Dumbbell size={14} /> Treino: {u.treino.nome}
          </p>
        )}
        {u.dieta ? (
          <p className="text-emerald-600 text-sm font-medium flex items-center gap-2">
            <Apple size={14} /> Dieta: {u.dieta.descricao}
          </p>
        ) : (
             <p className="text-gray-400 text-xs italic flex items-center gap-2">
                <Apple size={14} /> Sem dieta atribuída
            </p>
        )}
      </div>
    </div>
  );
};


// ------------------------------------------------------------------
// 📚 SUB-COMPONENTE: AssignmentModal
// ------------------------------------------------------------------
const AssignmentModal = ({
    modalOpen,
    setModalOpen,
    selectedUser,
    treinos,
    dietas,
    selectedTreinoId,
    setSelectedTreinoId,
    selectedDietaId,
    setSelectedDietaId,
    salvarTreino,
    handleDeleteVinculoTreinador,
}) => {
    const [searchTreino, setSearchTreino] = useState("");
    const [searchDieta, setSearchDieta] = useState("");

    const filteredTreinos = useMemo(() => {
        return treinos.filter(t => 
            t.nome.toLowerCase().includes(searchTreino.toLowerCase())
        );
    }, [searchTreino, treinos]);

    const filteredDietas = useMemo(() => {
        return dietas.filter(d => 
            d.descricao.toLowerCase().includes(searchDieta.toLowerCase())
        );
    }, [searchDieta, dietas]);


    const handleBackgroundClick = useCallback((e) => {
        if (e.target.id === "modalBackground") {
            setModalOpen(false);
        }
    }, [setModalOpen]);

    if (!modalOpen || !selectedUser) return null;

    return (
        <div
            id="modalBackground"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackgroundClick}
        >
            <div
                className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botão fechar */}
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-blue-700 mb-2 border-b pb-2 flex items-center gap-2">
                    <Dumbbell size={24} /> Atribuição de Plano
                </h2>

                <div className="mb-4">
                    <p className="font-medium text-lg text-gray-800">
                        {selectedUser.usuario?.nome}
                    </p>
                    <p className="text-sm text-gray-500">
                        Email: {selectedUser.usuario?.email}
                    </p>
                </div>

                {/* Seção Treino */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                        <Dumbbell size={16} className="text-blue-500" /> Selecionar Treino:
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar treino por nome..."
                        value={searchTreino}
                        onChange={(e) => setSearchTreino(e.target.value)}
                        className="px-3 py-2 mb-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        value={selectedTreinoId || ""}
                        onChange={(e) => setSelectedTreinoId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                        <option value="">Selecione um treino (Obrigatório)</option>
                        {filteredTreinos.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Seção Dieta */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-1">
                        <Apple size={16} className="text-emerald-500" /> Selecionar Dieta:
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar dieta por descrição..."
                        value={searchDieta}
                        onChange={(e) => setSearchDieta(e.target.value)}
                        className="px-3 py-2 mb-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400"
                    />
                    <select
                        value={selectedDietaId || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedDietaId(value === "" ? "" : Number(value));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-white"
                    >
                        <option value="">Selecione uma dieta (Opcional)</option>
                        {filteredDietas.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.descricao}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={salvarTreino}
                        disabled={!selectedTreinoId}
                        className={`w-full px-5 py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 
                            ${selectedTreinoId ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        <Save size={20} /> Salvar Atribuições
                    </button>

                    <div className="flex justify-between gap-3">
                        <button
                            onClick={handleDeleteVinculoTreinador}
                            className="flex-1 px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} /> Excluir vínculo
                        </button>
                        <button
                            onClick={() => setModalOpen(false)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all font-semibold"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ------------------------------------------------------------------
// 🎯 COMPONENTE PRINCIPAL
// ------------------------------------------------------------------
export default function UsuariosDoTreinador() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [dietas, setDietas] = useState([]);
  const [selectedTreinoId, setSelectedTreinoId] = useState(null);
  const [selectedDietaId, setSelectedDietaId] = useState(null); // "" significa remover dieta

  // 🔹 Carregar Usuários
  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const trainer = await getdadosTreinador();
      const trainerId = trainer?.id;

      const data = await getTreinoUsuarios();

      // Filtra apenas os usuários vinculados a este treinador
      const meusUsuarios = data.filter((u) => u.id_Treinador === trainerId);

      setUsuarios(meusUsuarios);
      setFilteredUsuarios(meusUsuarios);
    } catch (err) {
      console.error("❌ Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  // 🔹 Lógica de Filtro
  useEffect(() => {
    let filtered = usuarios;

    if (filters.search) {
      filtered = filtered.filter((u) =>
        u.usuario?.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((u) =>
        filters.status === "ativo" ? u.treino_ativo === true : u.treino_ativo === false
      );
    }

    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);


  // 🔹 Abrir Modal
  const abrirModal = async (usuario) => {
    setSelectedUser(usuario);
    setLoadingModal(true);

    try {
        // Popula os IDs atuais do usuário
        setSelectedTreinoId(usuario.id_Treino);
        setSelectedDietaId(usuario.id_Dieta || ""); // Usa "" para representar NULL/sem dieta

        // Carrega Treinos e Dietas disponíveis
        const [listaTreinos, listaDietas] = await Promise.all([
            getTreinos(),
            getDietas(),
        ]);

        setTreinos(listaTreinos);
        setDietas(listaDietas);
        
        setModalOpen(true);
    } catch (error) {
        console.error("Erro ao carregar dados para o modal:", error);
        alert("Erro ao carregar treinos e dietas.");
    } finally {
        setLoadingModal(false);
    }
  };


  // 🔹 SALVAR TREINO + DIETA
  const salvarTreino = async () => {
    if (!selectedTreinoId) {
      alert("Selecione um treino antes de salvar.");
      return;
    }
    
    // Converte "" (nenhuma dieta) para null no backend
    const dietaFinal = selectedDietaId === "" ? null : selectedDietaId;

    try {
      await updateTreinoUsuario(selectedUser.id, {
        id_Treino: selectedTreinoId,
        id_Dieta: dietaFinal,
        treino_ativo: true, // Ativa o treino ao salvar um novo plano
      });

      alert(`Plano de ${selectedUser.usuario?.nome} atualizado com sucesso!`);
      setModalOpen(false);
      loadUsuarios(); // Recarrega a lista para atualizar a visualização
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário.");
    }
  };

  // 🔹 DELETAR VÍNCULO (Treinador-Usuário)
  const handleDeleteVinculoTreinador = async () => {
    if (!window.confirm(`Tem certeza que deseja remover o vínculo com ${selectedUser.usuario?.nome}? Esta ação é irreversível.`)) return;
    try {
      await deleteTreinoTreinadorbyTreinador(selectedUser.id);

      alert("Vínculo deletado com sucesso!");
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar vínculo.");
    }
  };


  // ----------------------------------------------------------
  // 🎨 RENDERIZAÇÃO
  // ----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-100">
        
        {/* Header e Ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4 sm:mb-0">
            <Users size={32} /> Meus Alunos
          </h1>

          <button
            onClick={loadUsuarios}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all border border-gray-300 font-semibold"
            disabled={loading}
          >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <RefreshCw size={20} />
            )}
            Atualizar Lista
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 border rounded-xl bg-blue-50">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={20} className="text-blue-600" />
            <input
              type="text"
              placeholder="Buscar por nome do aluno..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Filter size={20} className="text-purple-600" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white text-gray-700"
            >
              <option value="">Todos os Status</option>
              <option value="ativo">Apenas Ativos</option>
              <option value="inativo">Apenas Inativos</option>
            </select>
          </div>
        </div>

        {/* Lista de Usuários */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 size={32} className="animate-spin mr-3 text-blue-500" />
            <p className="text-lg">Carregando usuários...</p>
          </div>
        ) : filteredUsuarios.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            <Users size={48} className="mx-auto mb-4 text-blue-400"/>
            <p>Nenhum aluno encontrado com os filtros aplicados.</p>
            <p className="text-sm mt-2">Você ainda não tem alunos vinculados.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {filteredUsuarios.map((u) => (
              <UserCard key={u.id} u={u} onDoubleClick={abrirModal} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Atribuição */}
      <AssignmentModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        selectedUser={selectedUser}
        treinos={treinos}
        dietas={dietas}
        selectedTreinoId={selectedTreinoId}
        setSelectedTreinoId={setSelectedTreinoId}
        selectedDietaId={selectedDietaId}
        setSelectedDietaId={setSelectedDietaId}
        salvarTreino={salvarTreino}
        handleDeleteVinculoTreinador={handleDeleteVinculoTreinador}
      />
    </div>
  );
}