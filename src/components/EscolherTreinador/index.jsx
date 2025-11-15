import { useEffect, useState } from "react";
import { getAllTreinadores } from "../../services/Treinador/treinadorService";
import { escolherTreinador } from "../../services/Usuario/TreinoUsuarioService";

export default function TreinadorDashboard() {
  const [treinadores, setTreinadores] = useState([]);
  const [filteredTreinadores, setFilteredTreinadores] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTreinadores();
  }, []);

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

  // 🔍 Filtros e buscas
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

  // 🔹 Selecionar treinador
  const handleSelect = async (id) => {
    if (!window.confirm("Tem certeza que deseja escolher este treinador?"))
      return;

    try {
      const res = await escolherTreinador(id);
      alert("Treinador escolhido com sucesso!");
      console.log(res);
    } catch (err) {
      console.error(err);
      alert("Erro ao selecionar treinador.");
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Título */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">🧑‍🏫 Treinadores</h1>

          <button
            onClick={loadTreinadores}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            🔄 Atualizar
          </button>
        </div>

        {/* 🔹 Filtros */}
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

        {/* 🔹 Lista */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando treinadores...</p>
        ) : filteredTreinadores.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum treinador encontrado.
          </p>
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
                  onClick={() => {
                    handleSelect(tr.id);
                  }}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Selecionar Treinador
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
