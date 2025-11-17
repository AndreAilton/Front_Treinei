import { useEffect, useState } from "react";
import {
  getTreinoUsuarios,
  updateTreinoUsuario,
  deleteTreinoTreinadorbyTreinador,
} from "../../services/Usuario/TreinoUsuarioService";

import { getdadosTreinador } from "../../services/Treinador/treinadorService";
import { getTreinos } from "../../services/Treinador/TreinosService";
import { getDietas } from "../../services/Treinador/DietasService";

export default function UsuariosDoTreinador() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [treinos, setTreinos] = useState([]);
  const [filteredTreinos, setFilteredTreinos] = useState([]);
  const [searchTreino, setSearchTreino] = useState("");
  const [selectedTreinoId, setSelectedTreinoId] = useState(null);

  const [dietas, setDietas] = useState([]);
  const [filteredDietas, setFilteredDietas] = useState([]);
  const [searchDieta, setSearchDieta] = useState("");
  const [selectedDietaId, setSelectedDietaId] = useState(null); // se voltar para "", vira null

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

  useEffect(() => {
    let filtered = usuarios;

    if (filters.search) {
      filtered = filtered.filter((u) =>
        u.usuario?.nome?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((u) =>
        filters.status === "ativo"
          ? u.treino_ativo === true
          : u.treino_ativo === false
      );
    }

    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);

  const abrirModal = async (usuario) => {
    setSelectedUser(usuario);

    setSelectedTreinoId(usuario.id_Treino);
    setSelectedDietaId(usuario.id_Dieta);

    const listaTreinos = await getTreinos();
    setTreinos(listaTreinos);
    setFilteredTreinos(listaTreinos);

    const listaDietas = await getDietas();
    setDietas(listaDietas);
    setFilteredDietas(listaDietas);

    setModalOpen(true);
  };

  useEffect(() => {
    setFilteredTreinos(
      treinos.filter((t) =>
        t.nome.toLowerCase().includes(searchTreino.toLowerCase())
      )
    );
  }, [searchTreino, treinos]);

  useEffect(() => {
    setFilteredDietas(
      dietas.filter((d) =>
        d.descricao.toLowerCase().includes(searchDieta.toLowerCase())
      )
    );
  }, [searchDieta, dietas]);

  // ----------------------------------------------------------
  // 🔥 SALVAR TREINO + DIETA
  // ----------------------------------------------------------
  const salvarTreino = async () => {
    try {
      // ❗ Regra 1: Não pode salvar dieta sem treino
      if (!selectedTreinoId) {
        alert("Selecione um treino antes de salvar.");
        return;
      }

      // ❗ Regra 2: Se o usuário voltar para "Selecione uma dieta", apagar dieta atual
      const dietaFinal = selectedDietaId === "" ? null : selectedDietaId;

      await updateTreinoUsuario(selectedUser.id, {
        id_Treino: selectedTreinoId,
        id_Dieta: dietaFinal, // 👈 dieta removida caso seja null
        treino_ativo: true,
      });

      alert("Dados atualizados com sucesso!");
      setModalOpen(false);
      loadUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário.");
    }
  };

  const handleDeleteVinculoTreinador = async () => {
    if (!window.confirm("Tem certeza que deseja remover este vínculo?")) return;
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

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">👤 Meus Alunos</h1>

          <button
            onClick={loadUsuarios}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            🔄 Atualizar
          </button>
        </div>

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
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Apenas Ativos</option>
            <option value="inativo">Apenas Inativos</option>
          </select>
        </div>

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

                {u.dieta ? (
                  <p className="text-emerald-600 text-sm font-medium mt-1">
                    🍎 Dieta ativa: {u.dieta.descricao}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-[420px] p-6 rounded-2xl shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Ajustar Treino / Dieta
            </h2>

            <p className="font-medium mb-2 text-gray-800">
              {selectedUser?.usuario?.nome}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Email: {selectedUser?.usuario?.email}
            </p>

            <input
              type="text"
              placeholder="Buscar treino..."
              value={searchTreino}
              onChange={(e) => setSearchTreino(e.target.value)}
              className="px-3 py-2 mb-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-400"
            />

            <label className="block text-gray-700 mb-2 font-medium">
              Selecionar Treino:
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

            <input
              type="text"
              placeholder="Buscar dieta..."
              value={searchDieta}
              onChange={(e) => setSearchDieta(e.target.value)}
              className="px-3 py-2 mb-3 w-full border rounded-xl focus:ring-2 focus:ring-blue-400"
            />

            <label className="block text-gray-700 mb-2 font-medium">
              Selecionar Dieta:
            </label>

            <select
              value={selectedDietaId || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDietaId(value === "" ? "" : Number(value)); // 👈 mantém "" para excluir
              }}
              className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 mb-4"
            >
              <option value="">Selecione uma dieta</option>
              {filteredDietas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.descricao}
                </option>
              ))}
            </select>

            <div className="flex justify-between mt-4 w-full">
              <button
                onClick={handleDeleteVinculoTreinador}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                🗑 Excluir vínculo
              </button>

              <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}
