import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getExercicios } from "../../services/ExerciciosService";
import { getTreinos } from "../../services/TreinosService";
import { createTreinoDia, getTreinoDias, deleteTreinoDia } from "../../services/TreinoDiasService";

export default function TreinoDias() {
  const [exercicios, setExercicios] = useState([]);
  const [filteredExercicios, setFilteredExercicios] = useState([]);
  const [treinoDias, setTreinoDias] = useState({});
  const [treinos, setTreinos] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    categoria: "",
    grupo: "",
    diaSemana: "",
    treinoSearch: "",
  });

  const diasSemana = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ];

  // 🔹 Carrega Exercícios e Treinos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [exData, trData] = await Promise.all([getExercicios(), getTreinos()]);
        setExercicios(exData || []);
        setFilteredExercicios(exData || []);
        setTreinos(trData || []);

        // Inicializa dias vazios
        const initDias = {};
        diasSemana.forEach((d) => (initDias[d] = []));
        setTreinoDias(initDias);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, []);

  // 🔹 Carrega os exercícios de um treino selecionado
  useEffect(() => {
    const fetchTreinoDias = async () => {
      if (!treinoSelecionado) return;
      try {
        const data = await getTreinoDias(treinoSelecionado);

        const initDias = {};
        diasSemana.forEach((dia) => (initDias[dia] = []));

        // Monta os dias com os exercícios vindos do banco
        data.forEach((item) => {
          const dia = item.Dia_da_Semana;
          if (initDias[dia]) {
            initDias[dia].push({
              id: item.id_Exercicio,
              nome: item.nome,
              Categoria: item.Categoria,
              Grupo_Muscular: item.Grupo_Muscular,
              Series: item.Series,
              Repeticoes: item.Repeticoes,
              Descanso: item.Descanso,
              Observacoes: item.Observacoes,
              idTreinoDia: item.id, // salva o id real do registro no banco
            });
          }
        });

        setTreinoDias(initDias);
      } catch (err) {
        console.error("Erro ao carregar treino selecionado:", err);
      }
    };

    fetchTreinoDias();
  }, [treinoSelecionado]);

  // 🔹 Filtros de exercícios
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

  const categorias = Array.from(new Set(exercicios.map((ex) => ex.Categoria).filter(Boolean)));
  const grupos = Array.from(new Set(exercicios.map((ex) => ex.Grupo_Muscular).filter(Boolean)));

  // 🔹 Drag & Drop
const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;
  if (!treinoSelecionado) return alert("⚠️ Selecione um treino antes de montar a semana!");

  const newTreino = { ...treinoDias };
  let exercicioMovido = null;

  // 🔹 Função auxiliar para verificar se já existe no dia
  const jaExisteNoDia = (dia, exId) => newTreino[dia].some((ex) => ex.id === exId);

  // 🔹 Arrastando do painel de exercícios para um dia
  if (source.droppableId === "exercicios" && destination.droppableId !== "exercicios") {
    exercicioMovido = filteredExercicios[source.index];

    if (jaExisteNoDia(destination.droppableId, exercicioMovido.id)) {
      return alert("⚠️ Este exercício já está nesse dia da semana!");
    }

    newTreino[destination.droppableId].splice(destination.index, 0, exercicioMovido);
    setTreinoDias(newTreino);

    try {
      const novoRegistro = await createTreinoDia({
        id_Treino: Number(treinoSelecionado),
        Dia_da_Semana: destination.droppableId,
        id_Exercicio: exercicioMovido.id,
        Series: exercicioMovido.Series || 4,
        Repeticoes: exercicioMovido.Repeticoes || 12,
        Descanso: exercicioMovido.Descanso || 60,
        Observacoes: exercicioMovido.Observacoes || "Executar com carga moderada",
      });
      exercicioMovido.idTreinoDia = novoRegistro.id;
    } catch (err) {
      console.error("❌ Erro ao criar treino-dia:", err);
    }
  }

  // 🔹 Movendo entre dias diferentes
  else if (source.droppableId !== destination.droppableId) {
    const [moved] = newTreino[source.droppableId].splice(source.index, 1);

    if (jaExisteNoDia(destination.droppableId, moved.id)) {
      return alert("⚠️ Este exercício já está nesse dia da semana!");
    }

    newTreino[destination.droppableId].splice(destination.index, 0, moved);
    setTreinoDias(newTreino);
    exercicioMovido = moved;

    try {
      // Apaga do dia de origem
      if (moved.idTreinoDia) {
        await deleteTreinoDia(moved.idTreinoDia);
      }

      // Cria no dia de destino
      const novoRegistro = await createTreinoDia({
        id_Treino: Number(treinoSelecionado),
        Dia_da_Semana: destination.droppableId,
        id_Exercicio: moved.id,
        Series: moved.Series || 4,
        Repeticoes: moved.Repeticoes || 12,
        Descanso: moved.Descanso || 60,
        Observacoes: moved.Observacoes || "Executar com carga moderada",
      });
      moved.idTreinoDia = novoRegistro.id;
    } catch (err) {
      console.error("❌ Erro ao mover treino-dia:", err);
    }
  }

  // 🔹 Reordenando dentro do mesmo dia
  else {
    const diaAtual = Array.from(newTreino[source.droppableId]);
    const [reordered] = diaAtual.splice(source.index, 1);
    diaAtual.splice(destination.index, 0, reordered);
    newTreino[source.droppableId] = diaAtual;
    setTreinoDias(newTreino);
  }
};


  const diasVisiveis = filters.diaSemana ? [filters.diaSemana] : diasSemana;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8 flex flex-col">
      <div className="flex flex-col flex-grow max-w-8xl mx-auto w-full bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200 overflow-hidden">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🧩 Montar Treino da Semana
        </h1>

        {/* 🔹 Selecionar Treino */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar treino..."
            value={filters.treinoSearch || ""}
            onChange={(e) => setFilters({ ...filters, treinoSearch: e.target.value })}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <select
            value={treinoSelecionado}
            onChange={(e) => setTreinoSelecionado(e.target.value)}
            className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Selecione um Treino</option>
            {treinos
              .filter((t) =>
                !filters.treinoSearch
                  ? true
                  : t.nome?.toLowerCase().includes(filters.treinoSearch.toLowerCase())
              )
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
          </select>
        </div>

        {!treinoSelecionado ? (
          <div className="flex flex-col items-center justify-center text-center h-[60vh] px-4">
            <p className="text-gray-600 text-lg">
              ⚠️ Escolha um treino antes de montar sua semana.
            </p>
          </div>
        ) : (
          <>
            {/* 🔹 Filtros */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              <input
                type="text"
                placeholder="Buscar exercício..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              {categorias.length > 0 && (
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Todos os Grupos</option>
                  {grupos.map((grp) => (
                    <option key={grp} value={grp}>
                      {grp}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={filters.diaSemana}
                onChange={(e) => setFilters({ ...filters, diaSemana: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Todos os Dias</option>
                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔹 Drag & Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
              {/* 🔸 Lista de Exercícios */}
              <Droppable droppableId="exercicios" isDropDisabled>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-center overflow-y-auto"
                    style={{ maxHeight: "250px" }}
                  >
                    {filteredExercicios.map((ex, index) => (
                      <Draggable key={ex.id} draggableId={ex.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-[180px] sm:w-[200px] bg-white border border-gray-300 rounded-xl p-3 shadow hover:shadow-lg transition-all cursor-grab"
                          >
                            <h3 className="font-semibold text-gray-800 truncate">
                              {ex.nome}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {ex.Grupo_Muscular}
                            </p>
                            <p className="text-xs text-gray-400">{ex.Categoria}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* 🔸 Grade da Semana */}
              <div className="flex-grow overflow-y-auto">
                <div
                  className={`grid ${
                    filters.diaSemana
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
                  } gap-4`}
                >
                  {diasVisiveis.map((dia) => (
                    <Droppable key={dia} droppableId={dia}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="bg-gray-100 border border-gray-300 rounded-xl p-3 flex flex-col shadow-inner min-h-[250px] sm:min-h-[350px]"
                        >
                          <h3 className="font-bold text-blue-700 text-center mb-2">{dia}</h3>

                          {(treinoDias[dia] || [])
                            .filter((ex) => ex && ex.id)
                            .map((ex, index) => (
                              <Draggable
                                key={`${dia}-${ex.id}`}
                                draggableId={`${dia}-${ex.id}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow cursor-grab hover:shadow-md transition-all"
                                  >
                                    <p className="font-medium text-gray-800 truncate">
                                      {ex.nome}
                                    </p>
                                    <p className="text-xs text-gray-500">{ex.Categoria}</p>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </div>
            </DragDropContext>
          </>
        )}
      </div>
    </div>
  );
}
