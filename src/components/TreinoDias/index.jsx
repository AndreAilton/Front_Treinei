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
  Video,
  PlayCircle
} from "lucide-react";

import { getExercicios } from "../../services/Treinador/ExerciciosService";
import { getTreinos } from "../../services/Treinador/TreinosService";
import {
  createTreinoDia,
  getTreinoDias,
  deleteTreinoDia,
  updateTreinoDia,
} from "../../services/Treinador/TreinoDiasService";

// --- Sub-Componente: InputGroup ---
const InputGroup = ({ label, Icon, value, onChange, type, min }) => (
  <div>
    <label className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5 text-sm">
      <Icon size={16} className="text-blue-500" /> {label}
    </label>
    <input
      type={type}
      min={min}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
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

  const videoUrl = selectedExercicio.videos?.[0]?.url
    ? `${selectedExercicio.videos[0].url}`
    : null;

  return (
    <div
      id="modalBackground"
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={fecharModal}
          className="absolute top-4 right-4 z-50 text-gray-400 hover:text-red-500 transition p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-transparent hover:border-gray-200"
        >
          <X size={24} />
        </button>

        {/* --- LADO ESQUERDO: VÍDEO --- */}
        <div className="w-full md:w-5/12 bg-gray-900 flex flex-col justify-center items-center relative min-h-[250px] md:min-h-auto">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain bg-black max-h-[40vh] md:max-h-full"
            />
          ) : (
            <div className="text-center p-8 text-gray-500 flex flex-col items-center">
              <PlayCircle size={48} className="mb-3 opacity-20" />
              <p className="text-sm">Vídeo não disponível</p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent md:hidden">
            <h2 className="text-white font-bold text-lg truncate">{selectedExercicio.nome}</h2>
          </div>
        </div>

        {/* --- LADO DIREITO: FORMULÁRIO E DADOS --- */}
        <div className="w-full md:w-7/12 p-6 md:p-8 overflow-y-auto bg-white flex flex-col">
            
          <div className="hidden md:block mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {selectedExercicio.nome}
            </h2>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                <Layers size={14}/> {selectedExercicio.Categoria}
              </span>
              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                <Target size={14}/> {selectedExercicio.Grupo_Muscular}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <InputGroup
              label="Séries"
              Icon={Layers}
              value={editData.Series}
              onChange={(e) => setEditData({ ...editData, Series: Number(e.target.value) })}
              type="number"
              min={1}
            />
            <InputGroup
              label="Reps"
              Icon={Repeat}
              value={editData.Repeticoes}
              onChange={(e) => setEditData({ ...editData, Repeticoes: Number(e.target.value) })}
              type="number"
              min={1}
            />
            <InputGroup
              label="Descanso"
              Icon={Clock}
              value={editData.Descanso}
              onChange={(e) => setEditData({ ...editData, Descanso: Number(e.target.value) })}
              type="number"
              min={0}
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5 text-sm">
              <FileText size={16} className="text-blue-500" /> Observações Técnicas
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 bg-gray-50 focus:bg-white resize-none"
              rows={4}
              value={editData.Observacoes}
              onChange={(e) => setEditData({ ...editData, Observacoes: e.target.value })}
              placeholder="Ex: Controlar a descida, focar na contração..."
            />
          </div>

          <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={salvarAlteracoes}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              Salvar Configuração
            </button>
            <button
              onClick={fecharModal}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Componente: ExercicioCard ---
const ExercicioCard = ({ ex, index, onDoubleClick, isDayItem = false }) => {
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
          ${isDayItem 
             ? "border-gray-200 mb-2 w-full" 
             : "border-blue-100 hover:border-blue-400 w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.33%-0.5rem)]" 
           }
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

  const [dndReady, setDndReady] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDndReady(true));
    return () => {
      cancelAnimationFrame(animation);
      setDndReady(false);
    };
  }, []);

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

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (!treinoSelecionado)
      return alert("⚠️ Selecione um treino antes de montar a semana!");

    const newTreino = { ...treinoDias };
    const sourceDia = source.droppableId;
    const destinationDia = destination.droppableId;

    // 1. REMOVER DO DIA (Arrastar de volta para "exercicios")
    if (destinationDia === "exercicios" && sourceDia !== "exercicios") {
        const exercicioRemovido = newTreino[sourceDia][source.index];
        
        // Remove do state local
        newTreino[sourceDia].splice(source.index, 1);
        setTreinoDias(newTreino);

        // Deleta do Banco de Dados
        try {
            if (exercicioRemovido.idTreinoDia) {
                await deleteTreinoDia(exercicioRemovido.idTreinoDia);
            }
        } catch (err) {
            console.error("❌ Erro ao deletar treino-dia:", err);
            alert("Erro ao remover exercício.");
        }
        return;
    }

    // 2. ADICIONAR (Arrastar da lista para um dia)
    if (sourceDia === "exercicios" && destinationDia !== "exercicios") {
      const exercicioMovido = filteredExercicios[source.index];

      if (newTreino[destinationDia].some((ex) => ex.id === exercicioMovido.id)) return;

      const novoExercicioUI = {
        ...exercicioMovido,
        Series: exercicioMovido.Series ?? 4,
        Repeticoes: exercicioMovido.Repeticoes ?? 12,
        Descanso: exercicioMovido.Descanso ?? 60,
        Observacoes: exercicioMovido.Observacoes ?? "Executar com carga moderada",
      };
      
      newTreino[destinationDia].splice(destination.index, 0, novoExercicioUI);
      setTreinoDias(newTreino);

      try {
        const payloadBackend = {
          id_treino: Number(treinoSelecionado),
          Dia_da_Semana: destinationDia,
          id_Exercicio: exercicioMovido.id,
          Series: novoExercicioUI.Series,
          Repeticoes: novoExercicioUI.Repeticoes,
          Descanso: novoExercicioUI.Descanso,
          Observacoes: novoExercicioUI.Observacoes
        };

        const novoRegistro = await createTreinoDia(payloadBackend);

        const updatedTreinoDias = { ...newTreino };
        updatedTreinoDias[destinationDia] = updatedTreinoDias[destinationDia].map(ex => {
            if (ex.id === exercicioMovido.id && !ex.idTreinoDia) {
                return { ...ex, idTreinoDia: novoRegistro.id };
            }
            return ex;
        });

        setTreinoDias(updatedTreinoDias);

      } catch (err) {
        console.error("❌ Erro ao criar treino-dia:", err);
        alert("Erro ao salvar o exercício no banco de dados.");
      }
      return;
    }

    // 3. MOVER ENTRE DIAS
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

    // 4. REORDENAR NO MESMO DIA
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


  if (!dndReady && !loading) {
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col">
      <div className="flex flex-col max-w-8xl mx-auto w-full bg-white shadow-2xl rounded-2xl p-6 md:p-8 border border-gray-100">
        
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
          <Calendar size={30} className="text-blue-600"/> Montar Treino da Semana
        </h1>

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

                        <div className="space-y-3 mb-4 ">
                            <input
                                type="text"
                                placeholder="Buscar exercício..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-400"
                            />
                            {/* Filtros Responsivos */}
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={filters.categoria}
                                    onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 min-w-[120px]"
                                >
                                    <option value="">Categorias</option>
                                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select
                                    value={filters.grupo}
                                    onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 min-w-[120px]"
                                >
                                    <option value="">Grupos</option>
                                    {grupos.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 italic ">
                                Dica: Arraste para o dia ou Duplo Clique para editar.
                            </p>
                        </div>
                        
                        <Droppable droppableId="exercicios">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex flex-wrap gap-2 overflow-y-auto pr-2 content-start h-full max-h-[600px] min-h-[200px]"
                                >
                                    {filteredExercicios.length === 0 ? (
                                        <div className="text-gray-500 italic text-sm text-center py-10 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-100/50">
                                            <Dumbbell className="mb-2 opacity-50" size={24}/>
                                            <p>Lista vazia.</p>
                                            <p className="text-xs mt-1">Solte aqui para remover do treino.</p>
                                        </div>
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

                    {/* 🔹 Grade da Semana - CORRIGIDO: Mobile 1 Coluna (grid-cols-1) */}
                    <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
                        {diasSemana.map((dia) => (
                            <Droppable key={dia} droppableId={dia}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col shadow-inner min-h-[350px] transition-colors hover:border-blue-400 h-full"
                                    >
                                        <h3 className="font-bold text-blue-700 text-center mb-3 pb-2 border-b border-blue-200">
                                            {dia}
                                        </h3>

                                        {treinoDias[dia]?.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center">
                                                <p className="text-sm text-gray-400 text-center italic">
                                                    Arraste exercícios para cá.
                                                </p>
                                            </div>
                                        )}

                                        {(treinoDias[dia] || []).map((ex, index) => (
                                            <ExercicioCard
                                                key={ex.idTreinoDia || `${ex.id}-temp`}
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