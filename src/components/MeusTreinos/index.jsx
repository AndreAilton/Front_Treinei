import { useEffect, useState, useCallback, useMemo } from "react";
import { getdadosUsuario } from "../../services/Usuario/usuarioAuthService";
import { 
  Loader2, 
  Dumbbell, 
  Clock, 
  X, 
  PlayCircle, 
  Info, 
  ChevronRight, 
  Target, 
  ExternalLink 
} from "lucide-react";

// --- 1. COMPONENTES AUXILIARES ---

const CategoryBadge = ({ text }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
    <Target size={12} /> {text || "Geral"}
  </span>
);

const StatBox = ({ icon: Icon, label, value, colorClass, bgClass }) => (
  <div className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl ${bgClass || 'bg-gray-50'} border border-transparent hover:border-gray-200 transition-all`}>
    <Icon size={24} className={`mb-2 ${colorClass || 'text-gray-600'}`} />
    <span className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</span>
    <span className="text-base md:text-lg font-bold text-gray-800">{value || "-"}</span>
  </div>
);

// --- 2. CARD DE EXERCÍCIO ---
const ExercicioCard = ({ item, aoClicar }) => {
  if (!item) return null;

  return (
    <div
      onClick={() => aoClicar(item)}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Dumbbell size={20} />
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
        </div>

        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-4 line-clamp-2 h-[3.5rem]">
          {item.exercicio?.nome || "Exercício sem nome"}
        </h3>

        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
          <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Séries</p>
              <p className="font-semibold text-gray-700">{item.Series || 0}</p>
          </div>
          <div className="text-center border-l border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Reps</p>
              <p className="font-semibold text-gray-700">{item.Repeticoes || 0}</p>
          </div>
          <div className="text-center border-l border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Descanso</p>
              <p className="font-semibold text-red-500">{item.Descanso || 0}s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. MODAL DE DETALHES ---
const ExercicioModal = ({ item, aoFechar }) => {
  if (!item) return null;

  const rawUrl = item.exercicio?.videos?.[0]?.url;
  const videoUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`) : null;  // Correção na verificação da URL
  console.log(rawUrl);

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={aoFechar}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row relative"
      >
        <button 
          onClick={aoFechar} 
          className="absolute top-4 right-4 z-50 bg-white hover:bg-red-50 text-gray-500 hover:text-red-500 p-2 rounded-full transition-all shadow-md"
        >
          <X size={20} />
        </button>

        {/* Lado Esquerdo: Vídeo */}
        <div className="w-full lg:w-5/12 bg-gray-900 flex flex-col justify-center items-center relative min-h-[250px] lg:min-h-full">
            {videoUrl ? (
                 <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                    preload="metadata"
                  />
            ) : (
                <div className="text-center p-8 text-gray-400">
                    <PlayCircle size={48} className="text-gray-600 mx-auto mb-4" />
                    <p>Vídeo indisponível</p>
                </div>
            )}
        </div>

        {/* Lado Direito: Informações */}
        <div className="w-full lg:w-7/12 p-6 md:p-8 overflow-y-auto bg-white">
            <div className="mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {item.Dia_da_Semana || "Detalhes"}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 leading-tight">
                    {item.exercicio?.nome || "Exercício"}
                </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatBox icon={Dumbbell} label="Séries" value={item.Series} bgClass="bg-blue-50" colorClass="text-blue-600"/>
                <StatBox icon={Target} label="Reps" value={item.Repeticoes} bgClass="bg-purple-50" colorClass="text-purple-600"/>
                <StatBox icon={Clock} label="Descanso" value={`${item.Descanso}s`} bgClass="bg-orange-50" colorClass="text-orange-600"/>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 border-b pb-2">
                    <Info size={20} className="text-blue-500"/>
                    <h3 className="text-lg font-bold">Instruções</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-600 text-sm md:text-base whitespace-pre-line">
                    {item.exercicio?.descricao || "Sem instruções cadastradas."}
                </div>
            </div>

            <button 
                onClick={aoFechar}
                className="mt-8 w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
                Concluir Visualização
            </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL ---
export default function MeusTreinos() {
  // === CORREÇÃO AQUI: Declaração correta do estado ===
  const [itemSelecionado, setItemSelecionado] = useState(null); 
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const diasSemanaOrdenados = [
    "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", 
    "Sexta-Feira", "Sábado", "Domingo",
  ];

  const carregarUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getdadosUsuario();
      // Tenta pegar o user de forma segura
      const data = response?.data?.user || response?.data || response;
      setUsuario(data);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
  }, [carregarUsuario]);

  // Extração segura dos dados
  const treinoUsuario = usuario?.usuarios_treino?.[0];
  const treino = treinoUsuario?.treino;
  const dias = treino?.treinos_dia || [];
  const linkDieta = treinoUsuario?.dieta;

  // Lógica de agrupamento
  const exerciciosAgrupados = useMemo(() => {
    if (!dias || dias.length === 0) return [];

    return diasSemanaOrdenados.map(diaSemana => {
      const exerciciosDoDia = dias.filter((d) => d?.Dia_da_Semana === diaSemana);
      if (exerciciosDoDia.length === 0) return null;

      const exerciciosPorCategoria = exerciciosDoDia.reduce((acc, ex) => {
        if (!ex || !ex.exercicio) return acc;

        const videos = ex.exercicio.videos || [];
        // Se não tiver categoria definida, usa "Geral"
        const categories = videos.length > 0 
          ? Array.from(new Set(videos.map(v => v?.category).filter(Boolean))) 
          : ["Geral"];

        const finalCategories = categories.length > 0 ? categories : ["Geral"];

        finalCategories.forEach((cat) => {
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(ex);
        });
        return acc;
      }, {});

      return { diaSemana, categorias: exerciciosPorCategoria };
    }).filter(Boolean);
  }, [dias]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Carregando treino...</p>
      </div>
    );
  }

  if (!usuario || !treino) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100 max-w-md">
           <Dumbbell size={32} className="text-gray-400 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-gray-800">Sem treino disponível</h2>
           <p className="text-gray-500 mt-2">Nenhum plano ativo encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 md:p-10 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-2xl md:text-4xl font-extrabold mb-2">Meu Plano de Treino</h1>
                <p className="text-blue-100 opacity-90">Foco, disciplina e resultado.</p>
            </div>
            
            {linkDieta && (
                <a
                    href={linkDieta.startsWith('http') ? linkDieta : `https://${linkDieta}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                    <ExternalLink size={18} /> Acessar Dieta
                </a>
            )}
        </div>

        {/* LISTA DE DIAS E EXERCÍCIOS */}
        <div className="space-y-10">
          {exerciciosAgrupados.map((diaAgrupado) => (
            <div key={diaAgrupado.diaSemana}>
              {/* Cabeçalho do Dia */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">{diaAgrupado.diaSemana}</h2>
              </div>

              {/* Grid de Categorias */}
              <div className="grid gap-6">
                {Object.keys(diaAgrupado.categorias).map((categoria) => (
                  <div key={categoria} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <CategoryBadge text={categoria} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {diaAgrupado.categorias[categoria].map((exercicio, index) => (
                        <ExercicioCard
                          key={exercicio.id || index}
                          item={exercicio}
                          // Aqui passamos a função para abrir o modal
                          aoClicar={setItemSelecionado}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RENDERIZAÇÃO DO MODAL */}
      {/* Verifica se itemSelecionado existe antes de renderizar */}
      {itemSelecionado && (
        <ExercicioModal 
          item={itemSelecionado} 
          aoFechar={() => setItemSelecionado(null)} 
        />
      )}
    </div>
  );
}