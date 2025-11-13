import { useEffect, useState } from "react";
import {
  getTreinoUsuarios,
  createTreinoUsuario,
  deleteTreinoUsuario,
} from "../../services/TreinoUsuarioService";
import { getTreinos } from "../../services/TreinosService";
import axios from "axios";

const API_USUARIOS = "http://localhost:3000/usuarios";

const VincularUsuarioTreino = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  const [idUsuario, setIdUsuario] = useState("");
  const [idTreino, setIdTreino] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Recupera o token salvo
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Buscar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(API_USUARIOS, {
        headers: getAuthHeader(),
      });
      // Alguns backends retornam {usuarios: [...]}, outros já retornam o array direto
      setUsuarios(response.data.usuarios || response.data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsuarios([]);
    }
  };

  // Buscar treinos
  const fetchTreinos = async () => {
    const data = await getTreinos();
    setTreinos(data);
  };

  // Buscar vínculos existentes
  const fetchVinculos = async () => {
    const data = await getTreinoUsuarios();
    setVinculos(data);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchTreinos();
    fetchVinculos();
  }, []);

  // Criar vínculo
  const handleVincular = async () => {
    if (!idUsuario || !idTreino) {
      setMessage("Selecione o usuário e o treino!");
      return;
    }

    setLoading(true);
    try {
      await createTreinoUsuario({
        id_Usuario: parseInt(idUsuario),
        id_Treino: parseInt(idTreino),
      });
      setMessage("✅ Treino vinculado com sucesso!");
      setIdUsuario("");
      setIdTreino("");
      fetchVinculos();
    } catch (error) {
      console.error("Erro ao vincular treino:", error);
      setMessage("❌ Erro ao vincular treino ao usuário.");
    } finally {
      setLoading(false);
    }
  };

  // Remover vínculo
  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir este vínculo?")) return;
    try {
      await deleteTreinoUsuario(id);
      fetchVinculos();
    } catch (error) {
      console.error("Erro ao deletar vínculo:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🔗 Vincular Usuário a Treino
      </h2>

      {/* Formulário */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Usuário */}
        <select
          value={idUsuario}
          onChange={(e) => setIdUsuario(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        >
          <option value="">Selecione o Usuário</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nome || user.username || `Usuário ${user.id}`}
            </option>
          ))}
        </select>

        {/* Treino */}
        <select
          value={idTreino}
          onChange={(e) => setIdTreino(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        >
          <option value="">Selecione o Treino</option>
          {treinos.map((treino) => (
            <option key={treino.id} value={treino.id}>
              {treino.nome || `Treino ${treino.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={handleVincular}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Vinculando..." : "Vincular"}
        </button>
      </div>

      {message && (
        <p className="text-center text-sm text-gray-700 mb-4">{message}</p>
      )}

      {/* Lista de vínculos */}
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        📋 Vínculos Existentes
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Usuário</th>
              <th className="p-2 border">Treino</th>
              <th className="p-2 border text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vinculos.length > 0 ? (
              vinculos.map((vinc) => (
                <tr key={vinc.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{vinc.id}</td>
                  <td className="p-2 border">
                    {vinc.usuario?.nome || `Usuário ${vinc.id_Usuario}`}
                  </td>
                  <td className="p-2 border">
                    {vinc.treino?.nome || `Treino ${vinc.id_Treino}`}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(vinc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-500 italic"
                >
                  Nenhum vínculo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VincularUsuarioTreino;
