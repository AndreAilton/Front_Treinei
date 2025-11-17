import { useEffect, useState } from "react";
import { getAllTreinadores } from "../../services/Treinador/treinadorService";
import {
  escolherTreinador,
  getTreinoUsuariosuser,
  deleteTreinoUsuariobyUser,
} from "../../services/Usuario/TreinoUsuarioService";

export default function TreinadorDashboard() {
  const [treinadores, setTreinadores] = useState([]);
  const [filteredTreinadores, setFilteredTreinadores] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  // Estado do vínculo do usuário
  const [statusTreino, setStatusTreino] = useState(null); // null | "aguardando" | "ativo"
  const [vinculo, setVinculo] = useState(null); // objeto retornado pela API (vínculo)

  useEffect(() => {
    // Carrega treinadores e status na montagem
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    await Promise.all([loadTreinadores(), carregarStatusTreino()]);
  };

  const loadTreinadores = async () => {
    setLoading(true);
    try {
      const data = await getAllTreinadores();
      const arr = Array.isArray(data) ? data : [];
      setTreinadores(arr);
      setFilteredTreinadores(arr);
    } catch (err) {
      console.error("Erro ao carregar treinadores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Normaliza/retorna o objeto de vínculo se vier em formatos diferentes
  const extrairVinculo = (res) => {
    if (!res) return null;

    // Se vier um array, pega o primeiro elemento
    if (Array.isArray(res)) {
      return res.length > 0 ? res[0] : null;
    }

    // Se vier com propriedade 'usuariosTreino'
    if (res.usuariosTreino) return res.usuariosTreino;

    // Se já for o objeto do vínculo
    if (res.id || res.treino_ativo !== undefined) return res;

    return null;
  };

  // Carrega status do vínculo do usuário
  const carregarStatusTreino = async () => {
    try {
      const res = await getTreinoUsuariosuser();

      const obj = extrairVinculo(res);

      if (!obj) {
        setVinculo(null);
        setStatusTreino(null);
        return;
      }

      setVinculo(obj);

      if (obj.treino_ativo === true) {
        setStatusTreino("ativo");
      } else if (obj.treino_ativo === false) {
        setStatusTreino("aguardando");
      } else {
        setStatusTreino(null);
      }
    } catch (err) {
      console.error("Erro ao buscar status do treino:", err);
      setVinculo(null);
      setStatusTreino(null);
    }
  };

  // Extrai um possible userId para passar ao deleteTreinoUsuariobyUser
  const getUserIdFromVinculo = (v) => {
    if (!v) return null;
    // tenta várias chaves possíveis conforme seu exemplo de retorno
    return (
      v.id_usuario ??
      v.id_Usuario ??
      v.idUsuario ??
      v.idUsuario ??
      v.usuario?.id ??
      v.id_usuario_fk ??
      null
    );
  };

  // Selecionar treinador
  const handleSelect = async (id) => {
    if (!window.confirm("Tem certeza que deseja escolher este treinador?")) return;

    try {
      const res = await escolherTreinador(id);

      // atualizar status via re-fetch para evitar inconsistências
      await carregarStatusTreino();
      alert("Treinador escolhido com sucesso!");
    } catch (err) {
      console.error("Erro ao selecionar treinador:", err);
      alert("Erro ao selecionar treinador.");
    }
  };

  // Deletar vínculo (botão ao lado de Atualizar)
  const handleDeleteVinculo = async () => {
    // pega id do usuário a partir do vínculo atual
    const userId = getUserIdFromVinculo(vinculo);

    if (!userId) {
      alert("Nenhum vínculo encontrado para deletar.");
      return;
    }

    if (!window.confirm("Deseja realmente deletar o vínculo com o treinador?")) return;

    try {
      await deleteTreinoUsuariobyUser(userId);
      alert("Vínculo deletado com sucesso.");
      // atualiza estado
      setVinculo(null);
      setStatusTreino(null);
      // re-carrega treinadores caso queira refletir mudanças
      await loadTreinadores();
    } catch (err) {
      console.error("Erro ao deletar vínculo:", err);
      alert("Erro ao deletar vínculo. Veja o console para mais detalhes.");
    }
  };

  // Cancelar vínculo (apenas wrapper que reutiliza delete)
  const cancelarTreino = async () => {
    await handleDeleteVinculo();
  };

  // Filtros de busca (sempre mantém os comportamentos anteriores)
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

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        {/* Título + Ações */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🧑‍🏫 Treinadores</h1>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                await loadTreinadores();
                await carregarStatusTreino();
              }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              🔄 Atualizar
            </button>

      
          </div>
        </div>

        {/* Status do treino do usuário */}
        {statusTreino === "aguardando" && (
          <div className="mb-4 p-4 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800 font-semibold">
            ⏳ Seu treinador ainda não aprovou seu treino. Aguarde aprovação.
          </div>
        )}

        {statusTreino === "ativo" && (
          <div className="mb-4 p-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-semibold">
            ✅ Seu treino está ativo!
          </div>
        )}

        {/* Botão de cancelar (aparece quando existir vínculo) */}
        {vinculo && (
          <div className="mb-6">
            <button
              onClick={cancelarTreino}
              className="w-full md:w-auto py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
            >
              ❌ Cancelar Treinador Atual
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome do treinador..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Apenas Ativos</option>
            <option value="inativo">Apenas Inativos</option>
          </select>
        </div>

        {/* Lista de treinadores */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando treinadores...</p>
        ) : filteredTreinadores.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum treinador encontrado.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredTreinadores.map((tr) => (
              <div
                key={tr.id}
                className="w-[260px] bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-gray-800 mb-1">{tr.nome}</h3>
                <p className="text-gray-500 text-sm mb-1">{tr.email}</p>

                <p
                  className={`text-sm font-semibold ${
                    tr.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tr.status ? "Ativo" : "Inativo"}
                </p>

                <button
                  onClick={() => handleSelect(tr.id)}
                  disabled={statusTreino !== null} // mantém comportamento anterior: bloqueia seleção se já houver vínculo
                  className={`w-full mt-3 py-2 rounded-xl transition-all ${
                    statusTreino !== null
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {statusTreino !== null ? "Treinador já escolhido" : "Selecionar Treinador"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
