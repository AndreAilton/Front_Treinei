import { useEffect, useState } from "react";
import {
  getTreinoUsuarios,
  updateTreinoUsuario,
} from "../../services/Usuario/TreinoUsuarioService";
import { getdadosTreinador } from "../../services/Treinador/treinadorService";
import { getTreinos } from "../../services/Treinador/TreinosService";

export default function UsuariosDoTreinador() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(false);

  // ----------------- MODAL -----------------
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [treinos, setTreinos] = useState([]);
  const [filteredTreinos, setFilteredTreinos] = useState([]);
  const [searchTreino, setSearchTreino] = useState("");
  const [selectedTreinoId, setSelectedTreinoId] = useState(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const trainer = await getdadosTreinador();
      const trainerId = trainer?.id;

      const data = await getTreinoUsuarios();

      const meusUsuarios = data.filter((u) => u.id_Treinador === trainerId);

      setUsuarios(meusUsuarios);
      setFilteredUsuarios(meusUsuarios);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  useEffect(() => {
    let filtered = usuarios;

    if (filters.search) {
      filtered = filtered.filter((u) =>
        u.usuario?.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((u) =>
        filters.status === "ativo" ? u.ativo === true : u.ativo === false
      );
    }

    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);

  // -------------------------------------------
  // 🔥 ABRIR MODAL AO DAR DOUBLE CLICK NO CARD
  // -------------------------------------------
  const abrirModal = async (usuario) => {
    setSelectedUser(usuario);
    setSelectedTreinoId(usuario.id_Treino);

    const listaTreinos = await getTreinos();
    setTreinos(listaTreinos);
    setFilteredTreinos(listaTreinos);

    setModalOpen(true);
  };

  // Filtro de treinos no modal
  useEffect(() => {
    setFilteredTreinos(
      treinos.filter((t) =>
        t.nome.toLowerCase().includes(searchTreino.toLowerCase())
      )
    );
  }, [searchTreino, treinos]);

  // Salvar treino
  const salvarTreino = async () => {
    try {
      await updateTreinoUsuario(selectedUser.id, {
        id_Treino: selectedTreinoId,
        treino_ativo: true,
      });

      alert("Treino atribuído e usuário ativado!");
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário.");
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        {/* Título */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">👤 Meus Usuários</h1>

          <button
            onClick={loadUsuarios}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            🔄 Atualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome do usuário..."
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

        {/* Lista */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando usuários...</p>
        ) : filteredUsuarios.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum usuário encontrado.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredUsuarios.map((u) => (
              <div
                key={u.id}
                onDoubleClick={() => abrirModal(u)}
                className="w-[260px] cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-gray-800 mb-1">
                  {u.usuario?.nome}
                </h3>

                <p className="text-gray-600 text-sm mb-1">
                  📩 {u.usuario?.email}
                </p>

                <p className="text-gray-600 text-sm mb-1">
                  📞 {u.usuario?.telefone}
                </p>

                <p
                  className={`text-sm font-semibold ${
                    u.treino_ativo ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {u.treino_ativo ? "Ativo" : "Inativo"}
                </p>

                {u.treino_ativo && u.treino ? (
                  <p className="text-blue-600 text-sm mt-2 font-medium">
                    🏋️ Treino ativo: {u.treino.nome}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------- */}
      {/* ------------------------ MODAL --------------------------- */}
      {/* ---------------------------------------------------------- */}

{modalOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
    onClick={() => setModalOpen(false)} // <-- FECHA ao clicar fora
  >
    <div
      className="bg-white w-[420px] p-6 rounded-2xl shadow-xl border border-gray-200"
      onClick={(e) => e.stopPropagation()} // <-- IMPEDIR fechar ao clicar dentro
    >
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Ajustar Treino do Usuário
      </h2>

      <p className="font-medium mb-2 text-gray-800">
        {selectedUser?.usuario?.nome}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Email: {selectedUser?.usuario?.email}
      </p>

      {/* Search treinos */}
      <input
        type="text"
        placeholder="Buscar treino..."
        value={searchTreino}
        onChange={(e) => setSearchTreino(e.target.value)}
        className="px-3 py-2 mb-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-400"
      />

      {/* Selecionar Treino */}
      <label className="block text-gray-700 mb-2 font-medium">
        Selecione o Treino:
      </label>

      <select
        value={selectedTreinoId || ""}
        onChange={(e) => setSelectedTreinoId(Number(e.target.value))}
        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 mb-4"
      >
        <option value="">Selecione um treino</option>
        {filteredTreinos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nome}
          </option>
        ))}
      </select>

      {/* Botões */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          onClick={salvarTreino}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
