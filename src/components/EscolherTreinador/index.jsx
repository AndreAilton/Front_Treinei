import { useEffect, useState, useCallback } from "react";
import {
  getAllTreinadores,
} from "../../services/Treinador/treinadorService";
import {
  escolherTreinador,
  getTreinoUsuariosuser,
  deleteTreinoUsuariobyUser,
} from "../../services/Usuario/TreinoUsuarioService";
import {
  Users,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  UserPlus,
  Trash2,
  Loader2,
  Shield,
  Award,
  User
} from "lucide-react";

// --- COMPONENTE VISUAL: AVATAR COM INICIAIS ---
const TrainerAvatar = ({ nome }) => {
  const getInitials = (n) => {
    if (!n) return "T";
    const names = n.split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
      {getInitials(nome)}
    </div>
  );
};

// --- COMPONENTE AUXILIAR: CARD DO TREINADOR ---
const TreinadorCard = ({ treinador, statusTreino, onSelect }) => {
  // Se já existe um vínculo (ativo ou aguardando), desabilitamos a seleção de outros
  const isDisabled = statusTreino !== null;
  const isInactive = !treinador.status;

  return (
    <div
      className={`group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all duration-300 flex flex-col
        ${isDisabled || isInactive ? "opacity-60 grayscale-[0.5]" : "hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
            <TrainerAvatar nome={treinador.nome} />
            <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{treinador.nome}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    treinador.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                    {treinador.status ? "Disponível" : "Indisponível"}
                </span>
            </div>
        </div>
        {treinador.status && (
            <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                <Award size={16} />
            </div>
        )}
      </div>

      <div className="flex-1">
          <p className="text-gray-500 text-sm mb-4 truncate flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
             <span className="text-gray-400">@</span> {treinador.email}
          </p>
      </div>

      <button
        onClick={() => onSelect(treinador.id)}
        disabled={isDisabled || isInactive}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          isDisabled || isInactive
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
        }`}
      >
        {statusTreino === "ativo" ? (
             <>Treinador Definido</>
        ) : statusTreino === "aguardando" ? (
             <>Aguardando Aprovação</>
        ) : isInactive ? (
             <>Indisponível</>
        ) : (
             <>
               <UserPlus size={18} /> Solicitar Treinamento
             </>
        )}
      </button>
    </div>
  );
};

// --- COMPONENTE DE STATUS HERO ---
const StatusHero = ({ status, vinculo, onCancel, submitting }) => {
    if (!status) return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Search className="text-blue-200" /> Encontre seu Treinador
                </h2>
                <p className="text-blue-100 max-w-xl">
                    Você ainda não possui um treinador vinculado. Escolha um profissional abaixo para começar sua jornada.
                </p>
             </div>
             {/* Elementos decorativos */}
             <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>
    );

    if (status === "aguardando") return (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                    <Clock size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-amber-800">Solicitação Enviada</h2>
                    <p className="text-amber-700 text-sm mt-1">
                        Aguardando o treinador aprovar seu vínculo.
                    </p>
                </div>
            </div>
            <button
                onClick={onCancel}
                disabled={submitting}
                className="px-6 py-2.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-xl font-semibold transition shadow-sm whitespace-nowrap"
            >
               {submitting ? "Processando..." : "Cancelar Solicitação"}
            </button>
        </div>
    );

    if (status === "ativo") return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
             <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                    <Shield size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-emerald-800">Treinamento Ativo</h2>
                    <p className="text-emerald-700 text-sm mt-1">
                        Seu plano de treino está vigente. Acesse "Meus Treinos" para ver os detalhes.
                    </p>
                </div>
            </div>
            <button
                onClick={onCancel}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl font-semibold transition shadow-sm whitespace-nowrap"
            >
               {submitting ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
               Encerrar Vínculo
            </button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function TreinadorDashboard() {
  const [treinadores, setTreinadores] = useState([]);
  const [filteredTreinadores, setFilteredTreinadores] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusTreino, setStatusTreino] = useState(null); // null | "aguardando" | "ativo"
  const [vinculo, setVinculo] = useState(null);

  // --- LÓGICA (Mantida idêntica para compatibilidade) ---
  const extrairVinculo = (res) => {
    if (!res) return null;
    if (Array.isArray(res)) return res.length > 0 ? res[0] : null;
    if (res.usuariosTreino) return res.usuariosTreino;
    if (res.id || res.treino_ativo !== undefined) return res;
    return null;
  };

  const carregarStatusTreino = useCallback(async () => {
    try {
      const res = await getTreinoUsuariosuser();
      const obj = extrairVinculo(res);

      if (!obj) {
        setVinculo(null);
        setStatusTreino(null);
        return;
      }

      setVinculo(obj);
      if (obj.treino_ativo === true) setStatusTreino("ativo");
      else if (obj.treino_ativo === false) setStatusTreino("aguardando");
      else setStatusTreino(null);
    } catch (err) {
      console.error("Erro status:", err);
      setVinculo(null);
      setStatusTreino(null);
    }
  }, []);

  const loadTreinadores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTreinadores();
      setTreinadores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro treinadores:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarTudo = useCallback(async () => {
    await Promise.all([loadTreinadores(), carregarStatusTreino()]);
  }, [loadTreinadores, carregarStatusTreino]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  // Handlers
  const getUserIdFromVinculo = (v) => {
    if (!v) return null;
    return v.id_usuario ?? v.id_Usuario ?? v.idUsuario ?? v.usuario?.id ?? v.id_usuario_fk ?? null;
  };

  const handleSelect = async (id) => {
    if (statusTreino !== null) return;
    if (!window.confirm("Confirmar a escolha deste treinador?")) return;

    setSubmitting(true);
    try {
      await escolherTreinador(id);
      await carregarStatusTreino();
      alert("Solicitação enviada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao selecionar.");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelarTreino = async () => {
    const userId = getUserIdFromVinculo(vinculo);
    if (!userId) {
      alert("Erro: ID de vínculo não encontrado.");
      return;
    }
    if (!window.confirm("Tem certeza que deseja cancelar o vínculo?")) return;
    
    setSubmitting(true);
    try {
      await deleteTreinoUsuariobyUser(userId);
      alert("Vínculo cancelado.");
      setVinculo(null);
      setStatusTreino(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao cancelar.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtros
  useEffect(() => {
    let filtered = treinadores;
    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.status) {
      filtered = filtered.filter((t) =>
        filters.status === "ativo" ? t.status === true : t.status === false
      );
    }
    setFilteredTreinadores(filtered);
  }, [filters, treinadores]);

  // --- JSX / RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER SIMPLES */}
        <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-blue-600" /> Profissionais
             </h1>
             <button
                onClick={carregarTudo}
                disabled={loading || submitting}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm"
                title="Atualizar lista"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
        </div>

        {/* STATUS SECTION (HERO) */}
        <StatusHero 
            status={statusTreino} 
            vinculo={vinculo} 
            onCancel={cancelarTreino} 
            submitting={submitting} 
        />

        {/* ÁREA DE BUSCA E FILTROS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar treinador por nome..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>
            
            <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            >
                <option value="">Todos os Status</option>
                <option value="ativo">Disponíveis</option>
                <option value="inativo">Indisponíveis</option>
            </select>
        </div>

        {/* GRID DE TREINADORES */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredTreinadores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">Nenhum profissional encontrado.</p>
            <p className="text-gray-400 text-sm">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreinadores.map((tr) => (
              <TreinadorCard
                key={tr.id}
                treinador={tr}
                statusTreino={statusTreino}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}