// src/pages/TreinoDias/TreinoDias.jsx
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getExercicios } from "../../services/Treinador/ExerciciosService";
import { getTreinos } from "../../services/Treinador/TreinosService";
import {
  createTreinoDia,
  getTreinoDias,
  deleteTreinoDia,
  updateTreinoDia,
} from "../../services/Treinador/TreinoDiasService";

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

  // 🔹 Estado do modal
  const [selectedExercicio, setSelectedExercicio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // dados editáveis no modal
  const [editData, setEditData] = useState({
    Series: 4,
    Repeticoes: 12,
    Descanso: 60,
    Observacoes: "",
  });

  const abrirModal = (exercicio) => {
    setSelectedExercicio(exercicio);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setSelectedExercicio(null);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modalBackground") {
      fecharModal();
    }
  };

  const diasSemana = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ];

  // quando selectedExercicio muda, popula editData com valores ou defaults
  useEffect(() => {
    if (selectedExercicio) {
      setEditData({
        Series:
          selectedExercicio.Series !== undefined ? selectedExercicio.Series : 4,
        Repeticoes:
          selectedExercicio.Repeticoes !== undefined
            ? selectedExercicio.Repeticoes
            : 12,
        Descanso:
          selectedExercicio.Descanso !== undefined
            ? selectedExercicio.Descanso
            : 60,
        Observacoes:
          selectedExercicio.Observacoes !== undefined
            ? selectedExercicio.Observacoes
            : "",
      });
    }
  }, [selectedExercicio]);

  // 🔹 Carrega Exercícios e Treinos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [exData, trData] = await Promise.all([
          getExercicios(),
          getTreinos(),
        ]);
        setExercicios(exData || []);
        setFilteredExercicios(exData || []);
        setTreinos(trData || []);

        const initDias = {};
        diasSemana.forEach((d) => (initDias[d] = []));
        setTreinoDias(initDias);
      } catch (err) {
        console.error("❌ Erro ao carregar dados iniciais:", err);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Buscar TreinoDias do backend
  useEffect(() => {
    if (!treinoSelecionado) return;

    const fetchTreinoDias = async () => {
      try {
        const data = await getTreinoDias();
        const diasMap = {};
        diasSemana.forEach((dia) => (diasMap[dia] = []));

        const filtrados = data.filter(
          (item) => item.id_treino === Number(treinoSelecionado)
        );

        filtrados.forEach((item) => {
          const dia = item.Dia_da_Semana?.trim();
          if (diasMap[dia]) {
            const exercicioInfo =
              exercicios.find((ex) => ex.id === item.id_Exercicio) || {};
            diasMap[dia].push({
              ...exercicioInfo,
              idTreinoDia: item.id,
              Series: item.Series,
              Repeticoes: item.Repeticoes,
              Descanso: item.Descanso,
              Observacoes: item.Observacoes,
            });
          }
        });
        setTreinoDias(diasMap);
      } catch (err) {
        console.error("❌ Erro ao buscar TreinoDias:", err);
      }
    };

    fetchTreinoDias();
  }, [treinoSelecionado, exercicios]);

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

    const idsNaSemana = Object.values(treinoDias)
      .flat()
      .map((ex) => ex.id);
    filtered = filtered.filter((ex) => !idsNaSemana.includes(ex.id));

    setFilteredExercicios(filtered);
  }, [filters, exercicios, treinoDias]);

  // 🔹 Função para salvar alterações (local + backend quando aplicável)
  const salvarAlteracoes = async () => {
    if (!selectedExercicio) return;

    const payload = {
      Series: Number(editData.Series),
      Repeticoes: Number(editData.Repeticoes),
      Descanso: Number(editData.Descanso),
      Observacoes: editData.Observacoes || "",
    };

    try {
      // Se existir idTreinoDia -> atualiza no backend
      if (selectedExercicio.idTreinoDia) {
        await updateTreinoDia(selectedExercicio.idTreinoDia, payload);

        // atualiza estado treinoDias local
        const novoTreinoDias = { ...treinoDias };
        Object.keys(novoTreinoDias).forEach((dia) => {
          novoTreinoDias[dia] = novoTreinoDias[dia].map((ex) => {
            if (ex.idTreinoDia === selectedExercicio.idTreinoDia) {
              return {
                ...ex,
                ...payload,
              };
            }
            return ex;
          });
        });
        setTreinoDias(novoTreinoDias);
      } else {
        // Não tem idTreinoDia -> apenas atualiza local (pode ser um exercício na lista ou já dentro de um dia sem idTreinoDia)
        // Atualiza filteredExercicios se o selectedExercicio estiver lá
        const updatedFiltered = filteredExercicios.map((ex) =>
          ex.id === selectedExercicio.id ? { ...ex, ...payload } : ex
        );
        setFilteredExercicios(updatedFiltered);

        // Também atualiza treinoDias caso haja alguma entrada sem idTreinoDia (precaução)
        const novoTreinoDias = { ...treinoDias };
        Object.keys(novoTreinoDias).forEach((dia) => {
          novoTreinoDias[dia] = novoTreinoDias[dia].map((ex) => {
            if (ex.id === selectedExercicio.id && !ex.idTreinoDia) {
              return { ...ex, ...payload };
            }
            return ex;
          });
        });
        setTreinoDias(novoTreinoDias);
      }

      fecharModal();
    } catch (err) {
      console.error("❌ Erro ao atualizar treino-dia:", err);
      alert("Erro ao atualizar exercício. Veja o console para mais detalhes.");
    }
  };

  // 🔹 Drag & Drop
  // 🔹 Drag & Drop
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (!treinoSelecionado)
      return alert("⚠️ Selecione um treino antes de montar a semana!");

    const newTreino = { ...treinoDias };

    // ⛔ Remover arrastando para a lista de exercícios
    if (
      source.droppableId !== "exercicios" &&
      destination.droppableId === "exercicios"
    ) {
      const diaOrigem = source.droppableId;
      const [exercicioRemovido] = newTreino[diaOrigem].splice(source.index, 1);
      setTreinoDias(newTreino);

      const confirmar = window.confirm(
        `Deseja realmente remover o exercício "${exercicioRemovido.nome}" do treino?`
      );

      if (confirmar && exercicioRemovido?.idTreinoDia) {
        try {
          await deleteTreinoDia(exercicioRemovido.idTreinoDia);
        } catch (err) {
          console.error("❌ Erro ao remover treino-dia:", err);
        }
      }
      return;
    }

    // ⭐ ADICIONAR EXERCÍCIO À SEMANA
    if (source.droppableId === "exercicios") {
      const exercicioMovido = filteredExercicios[source.index];

      const jaExiste = newTreino[destination.droppableId].some(
        (ex) => ex.id === exercicioMovido.id
      );
      if (jaExiste) return;

      newTreino[destination.droppableId].splice(
        destination.index,
        0,
        exercicioMovido
      );
      setTreinoDias(newTreino);

      try {
        const novoRegistro = await createTreinoDia({
          id_treino: Number(treinoSelecionado),
          Dia_da_Semana: destination.droppableId,
          id_Exercicio: exercicioMovido.id,
          Series: exercicioMovido.Series || 4,
          Repeticoes: exercicioMovido.Repeticoes || 12,
          Descanso: exercicioMovido.Descanso || 60,
          Observacoes:
            exercicioMovido.Observacoes || "Executar com carga moderada",
        });

        exercicioMovido.idTreinoDia = novoRegistro.id;
      } catch (err) {
        console.error("❌ Erro ao criar treino-dia:", err);
      }
    }

    // ⭐⭐ MOVER ENTRE DIAS (ATUALIZA O REGISTRO EXISTENTE — sem apagar!)
    else if (source.droppableId !== destination.droppableId) {
      const [moved] = newTreino[source.droppableId].splice(source.index, 1);

      const jaExiste = newTreino[destination.droppableId].some(
        (ex) => ex.id === moved.id
      );
      if (jaExiste) return;

      // move localmente
      newTreino[destination.droppableId].splice(destination.index, 0, moved);
      setTreinoDias(newTreino);

      try {
        if (moved.idTreinoDia) {
          // ⭐⭐⭐ AQUI ESTÁ A CORREÇÃO:
          await updateTreinoDia(moved.idTreinoDia, {
            Dia_da_Semana: destination.droppableId,
          });
        }
      } catch (err) {
        console.error("❌ Erro ao atualizar treino-dia:", err);
      }
    }

    // ⭐ reorder dentro do mesmo dia
    else {
      const diaAtual = Array.from(newTreino[source.droppableId]);
      const [reordered] = diaAtual.splice(source.index, 1);

      diaAtual.splice(destination.index, 0, reordered);
      newTreino[source.droppableId] = diaAtual;
      setTreinoDias(newTreino);
    }
  };

  const categorias = Array.from(
    new Set(exercicios.map((ex) => ex.Categoria).filter(Boolean))
  );
  const grupos = Array.from(
    new Set(exercicios.map((ex) => ex.Grupo_Muscular).filter(Boolean))
  );

  // 🔹 Renderização
  return (
    <div className="min-h-screen  from-blue-50 to-gray-100 p-4 md:p-8 flex flex-col">
      <div className="flex flex-col  max-w-8xl mx-auto w-full bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200 overflow-hidden">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🧩 Montar Treino da Semana
        </h1>

        {/* 🔹 Selecionar Treino */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar treino..."
            value={filters.treinoSearch || ""}
            onChange={(e) =>
              setFilters({ ...filters, treinoSearch: e.target.value })
            }
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
                  : t.nome
                      ?.toLowerCase()
                      .includes(filters.treinoSearch.toLowerCase())
              )
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
          </select>
        </div>

        {/* 🔹 Lista de Exercícios e Dias */}
        {treinoSelecionado && (
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Painel de Exercícios */}
            <Droppable droppableId="exercicios">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-center overflow-y-auto"
                  style={{ maxHeight: "250px" }}
                >
                  {filteredExercicios.map((ex, index) => (
                    <Draggable
                      key={ex.id}
                      draggableId={ex.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onDoubleClick={() => abrirModal(ex)} // 👈 duplo clique
                          className="w-[180px] sm:w-[200px] bg-white border border-gray-300 rounded-xl p-3 shadow hover:shadow-lg transition-all cursor-grab"
                        >
                          <h3 className="font-semibold text-gray-800 truncate">
                            {ex.nome}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {ex.Grupo_Muscular}
                          </p>
                          <p className="text-xs text-gray-400">
                            {ex.Categoria}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Grade da Semana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {diasSemana.map((dia) => (
                <Droppable key={dia} droppableId={dia}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-100 border border-gray-300 rounded-xl p-3 flex flex-col shadow-inner min-h-[250px]"
                    >
                      <h3 className="font-bold text-blue-700 text-center mb-2">
                        {dia}
                      </h3>
                      {(treinoDias[dia] || []).map((ex, index) => (
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
                              onDoubleClick={() => abrirModal(ex)} // 👈 aqui também
                              className="bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow cursor-grab hover:shadow-md transition-all"
                            >
                              <p className="font-medium text-gray-800 truncate">
                                {ex.nome}
                              </p>
                              <p className="text-xs text-gray-500">
                                {ex.Categoria}
                              </p>
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
          </DragDropContext>
        )}
      </div>

      {/* 🔹 MODAL DE EXERCÍCIO */}
      {isModalOpen && selectedExercicio && (
        <div
          id="modalBackground"
          onClick={handleBackgroundClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <div
            className="
      bg-white rounded-2xl shadow-xl relative animate-fadeIn 
      w-full max-w-lg 
      max-h-[90vh] overflow-y-auto
      p-6
    "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={fecharModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 break-words">
              {selectedExercicio.nome}
            </h2>

            {/* 🔥 Vídeo responsivo */}
            {selectedExercicio.videos && selectedExercicio.videos.length > 0 ? (
              <video
                src={`http://${selectedExercicio.videos[0].url.replace(
                  /^https?:\/\//,
                  ""
                )}`}
                controls
                className="w-full rounded-lg mb-4 max-h-[250px] object-contain"
              />
            ) : (
              <p className="text-gray-400 italic mb-4">
                🎥 Nenhum vídeo disponível
              </p>
            )}

            {/* Infos */}
            <p>
              <strong>Categoria:</strong> {selectedExercicio.Categoria}
            </p>
            <p>
              <strong>Grupo Muscular:</strong>{" "}
              {selectedExercicio.Grupo_Muscular}
            </p>

            {selectedExercicio.Observacoes && (
              <p className="mt-3 text-gray-600 break-words">
                <strong>Observações:</strong> {selectedExercicio.Observacoes}
              </p>
            )}

            {/* 🔥 Inputs agora responsivos em coluna no mobile */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">Séries</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded-xl px-3 py-2"
                  value={editData.Series}
                  onChange={(e) =>
                    setEditData({ ...editData, Series: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Repetições
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded-xl px-3 py-2"
                  value={editData.Repeticoes}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      Repeticoes: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Descanso (s)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full border rounded-xl px-3 py-2"
                  value={editData.Descanso}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      Descanso: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700">
                  Observações
                </label>
                <textarea
                  className="w-full border rounded-xl px-3 py-2 min-h-[80px]"
                  value={editData.Observacoes}
                  onChange={(e) =>
                    setEditData({ ...editData, Observacoes: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={salvarAlteracoes}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
              >
                Salvar Alterações
              </button>

              <button
                onClick={fecharModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
