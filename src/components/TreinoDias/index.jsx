import { useEffect, useState, useMemo, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Search,
  Dumbbell,
  Calendar,
  Layers,
  Clock,
  Repeat,
  Target,
  FileText,
  X,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { getExercicios } from "../../services/Treinador/ExerciciosService";
import { getTreinos } from "../../services/Treinador/TreinosService";
import {
  createTreinoDia,
  getTreinoDias,
  deleteTreinoDia,
  updateTreinoDia,
} from "../../services/Treinador/TreinoDiasService";

// --- Sub-Componente: InputGroup (para o Modal) ---
const InputGroup = ({ label, Icon, value, onChange, type, min }) => (
  <div>
    <label className="font-semibold text-gray-700 flex items-center gap-1 mb-1">
      <Icon size={18} className="text-blue-500" /> {label}
    </label>
    <input
      type={type}
      min={min}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      value={value}
      onChange={onChange}
    />
  </div>
);

// --- Sub-Componente: ExercicioModal ---
const ExercicioModal = ({
  selectedExercicio,
  isModalOpen,
  fecharModal,
  handleBackgroundClick,
  editData,
  setEditData,
  salvarAlteracoes,
}) => {
  if (!isModalOpen || !selectedExercicio) return null;

  return (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={fecharModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-2 border-b pb-2">
          <Dumbbell size={24} /> {selectedExercicio.nome}
        </h2>

        {/* Informações do Exercício */}
        <div className="text-sm text-gray-600 mb-4 flex gap-4">
          <p className="flex items-center gap-1">
            <Layers size={14} className="text-purple-500" />
            {selectedExercicio.Categoria}
          </p>
          <p className="flex items-center gap-1">
            <Target size={14} className="text-green-500" />
            {selectedExercicio.Grupo_Muscular}
          </p>
        </div>

        {/* Vídeo */}
        {selectedExercicio.videos && selectedExercicio.videos.length > 0 ? (
          <div className="w-full bg-gray-100 rounded-lg mb-4 overflow-hidden shadow-inner">
            <video
              src={`http://${selectedExercicio.videos[0].url.replace(
                /^https?:\/\//,
                ""
              )}`}
              controls
              className="w-full max-h-[250px] object-cover"
            />
          </div>
        ) : (
          <p className="text-gray-400 italic mb-4 p-4 border rounded-lg bg-gray-50">
            🎥 Nenhum vídeo de demonstração disponível.
          </p>
        )}

        {/* Formulário de Edição */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup
            label="Séries"
            Icon={Repeat}
            value={editData.Series}
            onChange={(e) =>
              setEditData({ ...editData, Series: Number(e.target.value) })
            }
            type="number"
            min={1}
          />

          <InputGroup
            label="Repetições"
            Icon={Repeat}
            value={editData.Repeticoes}
            onChange={(e) =>
              setEditData({ ...editData, Repeticoes: Number(e.target.value) })
            }
            type="number"
            min={1}
          />

          <InputGroup
            label="Descanso (s)"
            Icon={Clock}
            value={editData.Descanso}
            onChange={(e) =>
              setEditData({ ...editData, Descanso: Number(e.target.value) })
            }
            type="number"
            min={0}
          />

          <div className="sm:col-span-2">
            <label className="font-semibold text-gray-700 flex items-center gap-1 mb-1">
              <FileText size={18} className="text-blue-500" /> Observações
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95"
          >
            Salvar Alterações
          </button>

          <button
            onClick={fecharModal}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-xl font-semibold transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Componente: ExercicioCard ---
const ExercicioCard = ({ ex, index, onDoubleClick, isDayItem = false }) => {
  // O draggableId deve ser único. Para o dia, usamos o idTreinoDia (se existir).
  const draggableId = isDayItem ? (ex.idTreinoDia ? ex.idTreinoDia.toString() : `${ex.id}-temp`) : ex.id.toString();

  const Card = useCallback(
    ({ provided }) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onDoubleClick={() => onDoubleClick(ex)}
        className={`
          bg-white border rounded-xl p-3 shadow cursor-grab hover:shadow-lg transition-all 
          ${isDayItem ? "border-gray-200 mb-2" : "border-blue-100 hover:border-blue-400 w-full sm:w-[200px]"}
        `}
      >
        <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1">
          <Dumbbell size={16} className="text-blue-500" />
          {ex.nome}
        </h3>

        <div className="mt-1 text-xs space-y-0.5">
          <p className="text-gray-500 flex items-center gap-1">
            <Target size={12} className="text-green-500" /> {ex.Grupo_Muscular}
          </p>
          <p className="text-gray-400 flex items-center gap-1">
            <Layers size={12} className="text-purple-500" /> {ex.Categoria}
          </p>

          {isDayItem && (
            <div className="pt-2 border-t mt-2 flex flex-wrap gap-x-3 gap-y-1 text-blue-600 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <Repeat size={10} /> {ex.Series}x{ex.Repeticoes}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {ex.Descanso}s
              </span>
              {ex.Observacoes && ex.Observacoes.length > 0 && (
                <span className="text-yellow-600 flex items-center gap-1 italic">
                  <FileText size={10} /> Obs
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    [ex, onDoubleClick, isDayItem]
  );

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => <Card provided={provided} />}
    </Draggable>
  );
};


// --- Componente Principal: TreinoDias ---
export default function TreinoDias() {
  const [exercicios, setExercicios] = useState([]);
  const [filteredExercicios, setFilteredExercicios] = useState([]);
  const [treinoDias, setTreinoDias] = useState({});
  const [treinos, setTreinos] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    categoria: "",
    grupo: "",
    treinoSearch: "",
  });

  // 🔹 Estado do modal
  const [selectedExercicio, setSelectedExercicio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    Series: 4,
    Repeticoes: 12,
    Descanso: 60,
    Observacoes: "",
  });

  const diasSemana = useMemo(() => [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo",
  ], []);

  const abrirModal = useCallback((exercicio) => {
    setSelectedExercicio(exercicio);
    setIsModalOpen(true);
  }, []);

  const fecharModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedExercicio(null);
  }, []);

  const handleBackgroundClick = useCallback((e) => {
    if (e.target.id === "modalBackground") {
      fecharModal();
    }
  }, [fecharModal]);

  // Popula editData com valores do exercício selecionado ou defaults
  useEffect(() => {
    if (selectedExercicio) {
      setEditData({
        Series: selectedExercicio.Series ?? 4,
        Repeticoes: selectedExercicio.Repeticoes ?? 12,
        Descanso: selectedExercicio.Descanso ?? 60,
        Observacoes: selectedExercicio.Observacoes ?? "",
      });
    }
  }, [selectedExercicio]);

  // 🔹 Carrega Exercícios e Treinos Iniciais
  const loadData = useCallback(async () => {
    setLoading(true);
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
      alert("Erro ao carregar dados iniciais.");
    } finally {
      setLoading(false);
    }
  }, [diasSemana]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔹 Buscar TreinoDias do backend (ao mudar o treino selecionado)
  useEffect(() => {
    if (!treinoSelecionado || loading || exercicios.length === 0) return;

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
  }, [treinoSelecionado, exercicios, diasSemana, loading]);

  // 🔹 Filtros de exercícios disponíveis
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

    // Filtra exercícios que JÁ estão na semana
    const idsNaSemana = Object.values(treinoDias)
      .flat()
      .map((ex) => ex.id);
    filtered = filtered.filter((ex) => !idsNaSemana.includes(ex.id));

    setFilteredExercicios(filtered);
  }, [filters, exercicios, treinoDias]);

  // 🔹 Função para salvar alterações (local + backend)
  const salvarAlteracoes = async () => {
    if (!selectedExercicio) return;

    const payload = {
      Series: Number(editData.Series),
      Repeticoes: Number(editData.Repeticoes),
      Descanso: Number(editData.Descanso),
      Observacoes: editData.Observacoes || "",
    };

    try {
      if (selectedExercicio.idTreinoDia) {
        await updateTreinoDia(selectedExercicio.idTreinoDia, payload);

        // Atualiza estado treinoDias local
        const novoTreinoDias = { ...treinoDias };
        const updatedTreinoDias = Object.fromEntries(
          Object.entries(novoTreinoDias).map(([dia, exs]) => [
            dia,
            exs.map((ex) => {
              return ex.idTreinoDia === selectedExercicio.idTreinoDia
                ? { ...ex, ...payload }
                : ex;
            }),
          ])
        );
        setTreinoDias(updatedTreinoDias);
        alert("Configurações do exercício atualizadas com sucesso!");
      } else {
        // Atualiza filteredExercicios (para exercícios na lista de origem)
        const updatedFiltered = filteredExercicios.map((ex) =>
          ex.id === selectedExercicio.id ? { ...ex, ...payload } : ex
        );
        setFilteredExercicios(updatedFiltered);
        alert("Dados iniciais do exercício atualizados localmente.");
      }

      fecharModal();
    } catch (err) {
      console.error("❌ Erro ao atualizar treino-dia:", err);
      alert("Erro ao atualizar exercício. Veja o console para mais detalhes.");
    }
  };

  // 🔹 Drag & Drop principal
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (!treinoSelecionado)
      return alert("⚠️ Selecione um treino antes de montar a semana!");

    const newTreino = { ...treinoDias };
    const sourceDia = source.droppableId;
    const destinationDia = destination.droppableId;

    // 1. REMOVER (arrastando para a lista de exercícios)
    if (sourceDia !== "exercicios" && destinationDia === "exercicios") {
      const [exercicioRemovido] = newTreino[sourceDia].splice(source.index, 1);
      setTreinoDias(newTreino);

      const confirmar = window.confirm(
        `Deseja realmente remover o exercício "${exercicioRemovido.nome}" do dia ${sourceDia}?`
      );

      if (confirmar && exercicioRemovido?.idTreinoDia) {
        try {
          await deleteTreinoDia(exercicioRemovido.idTreinoDia);
          // O useEffect de filtros cuidará de repopular filteredExercicios
        } catch (err) {
          console.error("❌ Erro ao remover treino-dia:", err);
          alert("Erro ao remover o exercício no servidor.");
        }
      }
      return;
    }

    // 2. ADICIONAR (arrastando da lista de exercícios para um dia)
    if (sourceDia === "exercicios" && destinationDia !== "exercicios") {
      const exercicioMovido = filteredExercicios[source.index];

      if (newTreino[destinationDia].some((ex) => ex.id === exercicioMovido.id)) return;

      const novoExercicio = {
        ...exercicioMovido,
        Series: exercicioMovido.Series ?? 4,
        Repeticoes: exercicioMovido.Repeticoes ?? 12,
        Descanso: exercicioMovido.Descanso ?? 60,
        Observacoes: exercicioMovido.Observacoes ?? "Executar com carga moderada",
      };
      
      newTreino[destinationDia].splice(destination.index, 0, novoExercicio);
      setTreinoDias(newTreino);

      try {
        const novoRegistro = await createTreinoDia({
          id_treino: Number(treinoSelecionado),
          Dia_da_Semana: destinationDia,
          id_Exercicio: exercicioMovido.id,
          ...novoExercicio,
        });

        // Atualiza o estado local com o ID do backend
        novoExercicio.idTreinoDia = novoRegistro.id;
        setTreinoDias({ ...newTreino });

      } catch (err) {
        console.error("❌ Erro ao criar treino-dia:", err);
      }
      return;
    }

    // 3. MOVER ENTRE DIAS (ATUALIZA O DIA DA SEMANA)
    if (sourceDia !== destinationDia) {
      const [moved] = newTreino[sourceDia].splice(source.index, 1);
      
      if (newTreino[destinationDia].some((ex) => ex.id === moved.id)) return;
      
      newTreino[destinationDia].splice(destination.index, 0, moved);
      setTreinoDias(newTreino);

      try {
        if (moved.idTreinoDia) {
          await updateTreinoDia(moved.idTreinoDia, {
            Dia_da_Semana: destinationDia,
          });
        }
      } catch (err) {
        console.error("❌ Erro ao atualizar treino-dia:", err);
        alert("Erro ao mover exercício no servidor.");
      }
      return;
    }

    // 4. REORDER (dentro do mesmo dia)
    if (sourceDia === destinationDia) {
      const diaAtual = Array.from(newTreino[sourceDia]);
      const [reordered] = diaAtual.splice(source.index, 1);
      diaAtual.splice(destination.index, 0, reordered);
      newTreino[sourceDia] = diaAtual;
      setTreinoDias(newTreino);
    }
  };


  const categorias = useMemo(() => Array.from(
    new Set(exercicios.map((ex) => ex.Categoria).filter(Boolean))
  ), [exercicios]);

  const grupos = useMemo(() => Array.from(
    new Set(exercicios.map((ex) => ex.Grupo_Muscular).filter(Boolean))
  ), [exercicios]);


  // 🔹 Renderização
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col">
      <div className="flex flex-col max-w-8xl mx-auto w-full bg-white shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-100">
        
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
          <Calendar size={30} className="text-blue-600"/> Montar Treino da Semana
        </h1>

        {/* 🔹 Controle de Seleção de Treino e Filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 border rounded-xl bg-blue-50">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="font-semibold text-gray-700 whitespace-nowrap flex items-center gap-1">
                    <Dumbbell size={20} className="text-blue-600"/> Treino:
                </label>
                <select
                    value={treinoSelecionado}
                    onChange={(e) => {
                        setTreinoSelecionado(e.target.value);
                        setFilters(prev => ({...prev, treinoSearch: ""}))
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={loading}
                >
                    <option value="">{loading ? "Carregando..." : "Selecione um Treino"}</option>
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

            <input
                type="text"
                placeholder="Filtrar treinos por nome..."
                value={filters.treinoSearch || ""}
                onChange={(e) =>
                    setFilters({ ...filters, treinoSearch: e.target.value })
                }
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <Loader2 size={32} className="animate-spin mr-3 text-blue-500" />
                <p className="text-lg">Carregando dados...</p>
            </div>
        ) : (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 🔹 Painel de Exercícios Disponíveis (Fonte) */}
                    <div className="w-full lg:w-1/4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner flex flex-col min-h-[500px]">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-green-600"/> Exercícios Disponíveis
                        </h3>

                        {/* Filtros do painel de exercícios */}
                        <div className="space-y-3 mb-4">
                            <input
                                type="text"
                                placeholder="Buscar exercício..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-400"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={filters.categoria}
                                    onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                                >
                                    <option value="">Categorias</option>
                                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select
                                    value={filters.grupo}
                                    onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                                >
                                    <option value="">Grupos Musculares</option>
                                    {grupos.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                Dica: Arraste para o dia ou Duplo Clique para editar.
                            </p>
                        </div>
                        
                        <Droppable droppableId="exercicios">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex-1 space-y-3 overflow-y-auto pr-2"
                                >
                                    {filteredExercicios.length === 0 ? (
                                        <p className="text-gray-500 italic text-sm text-center py-4">
                                            Nenhum exercício disponível.
                                        </p>
                                    ) : (
                                        filteredExercicios.map((ex, index) => (
                                            <ExercicioCard
                                                key={ex.id}
                                                ex={ex}
                                                index={index}
                                                onDoubleClick={abrirModal}
                                            />
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* 🔹 Grade da Semana (Destinos) */}
                    <div className="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
                        {diasSemana.map((dia) => (
                            <Droppable key={dia} droppableId={dia}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col shadow-inner min-h-[350px] transition-colors hover:border-blue-400"
                                    >
                                        <h3 className="font-bold text-blue-700 text-center mb-3 pb-2 border-b border-blue-200">
                                            {dia}
                                        </h3>

                                        {treinoDias[dia]?.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center italic mt-10">
                                                Arraste exercícios para cá.
                                            </p>
                                        )}

                                        {(treinoDias[dia] || []).map((ex, index) => (
                                            <ExercicioCard
                                                key={ex.idTreinoDia || `${ex.id}-temp`} // Usa idTreinoDia como chave primária
                                                ex={ex}
                                                index={index}
                                                onDoubleClick={abrirModal}
                                                isDayItem={true}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        )}
        
        {!treinoSelecionado && !loading && (
            <div className="text-center py-20 text-gray-500 text-xl">
                <Calendar size={48} className="mx-auto mb-4 text-blue-400"/>
                Selecione um treino acima para começar a montar o cronograma semanal.
            </div>
        )}

      </div>

      {/* 🔹 MODAL DE EXERCÍCIO */}
      <ExercicioModal
        selectedExercicio={selectedExercicio}
        isModalOpen={isModalOpen}
        fecharModal={fecharModal}
        handleBackgroundClick={handleBackgroundClick}
        editData={editData}
        setEditData={setEditData}
        salvarAlteracoes={salvarAlteracoes}
      />
    </div>
  );
}