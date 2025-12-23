import { useEffect, useState, useCallback, useMemo } from "react";
import { getdadosUsuario } from "../../services/Usuario/usuarioAuthService";
import { 
  Loader2, 
  Dumbbell, 
  Clock, 
  PlayCircle, 
  Target, 
  CalendarCheck,
  Coffee,
  AlertCircle
} from "lucide-react";

// --- 1. COMPONENTES VISUAIS AUXILIARES ---

const StatBadge = ({ icon: Icon, label, value, color }) => {
  // Mapas de cores para estilização dinâmica
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-xl border ${colorMap[color] || colorMap.gray} flex-1`}>
      <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 mb-1 flex items-center gap-1">
        <Icon size={12} /> {label}
      </span>
      <span className="text-sm md:text-base font-extrabold">{value}</span>
    </div>
  );
};

// --- 2. CARD DE EXERCÍCIO COM VÍDEO INTEGRADO ---
const ExercicioCard = ({ item }) => {
  if (!item) return null;

  // Tratamento da URL do vídeo
  const rawUrl = item.exercicio?.videos?.[0]?.url;
  const videoUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${rawUrl}`) : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* ÁREA DO VÍDEO (Hero do Card) */}
      <div className="relative w-full aspect-video bg-gray-900 group">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata" // Importante para não pesar a página
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
            <PlayCircle size={48} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">Sem vídeo</span>
          </div>
        )}
      </div>

      {/* CONTEÚDO DO CARD */}
      <div className="p-5 flex flex-col flex-1">
        {/* Título e Categoria */}
        <div className="mb-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-extrabold text-gray-800 text-lg leading-tight line-clamp-2">
              {item.exercicio?.nome || "Exercício"}
            </h3>
            {/* Categoria Badge (opcional, pegando do primeiro vídeo ou padrão) */}
            <span className="shrink-0 px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md tracking-wide">
              {item.exercicio?.videos?.[0]?.category || "Geral"}
            </span>
          </div>
        </div>

        {/* Grid de Estatísticas (Séries, Reps, Descanso) */}
        <div className="flex gap-2 mb-4">
          <StatBadge icon={Dumbbell} label="Séries" value={item.Series || "-"} color="blue" />
          <StatBadge icon={Target} label="Reps" value={item.Repeticoes || "-"} color="purple" />
          <StatBadge icon={Clock} label="Descanso" value={`${item.Descanso || 0}s`} color="orange" />
        </div>

        {/* Instruções / Descrição */}
        {item.exercicio?.descricao && (
          <div className="bg-gray-50 rounded-xl p-3 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
              <AlertCircle size={12} /> Dicas
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
              {item.exercicio.descricao}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. COMPONENTE PRINCIPAL ---
export default function UserLoginHome() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapa de dias para converter getDay() (0-6) para string do banco
  const mapaDiasSemana = useMemo(() => [
    "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", 
    "Quinta-Feira", "Sexta-Feira", "Sábado"
  ], []);

  const carregarUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getdadosUsuario();
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

  // Lógica de Filtragem do Treino de HOJE
  const treinoDoDia = useMemo(() => {
    if (!usuario?.usuarios_treino?.[0]?.treino?.treinos_dia) return null;

    const hojeIndex = new Date().getDay();
    const hojeString = mapaDiasSemana[hojeIndex];
    const todosTreinos = usuario.usuarios_treino[0].treino.treinos_dia;

    // Filtra apenas exercícios de hoje
    const exerciciosHoje = todosTreinos.filter(t => t.Dia_da_Semana === hojeString);

    if (exerciciosHoje.length === 0) return { hojeString, categorias: {}, totalExercicios: 0 };

    // Agrupa por categoria para organização visual
    const exerciciosPorCategoria = exerciciosHoje.reduce((acc, ex) => {
      if (!ex || !ex.exercicio) return acc;
      
      // Tenta pegar a categoria do vídeo, se não existir usa "Principal"
      const cat = ex.exercicio.videos?.[0]?.category || "Sequência Principal";
      
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ex);
      return acc;
    }, {});

    return { hojeString, categorias: exerciciosPorCategoria, totalExercicios: exerciciosHoje.length };
  }, [usuario, mapaDiasSemana]);

  // --- RENDERS DE ESTADO ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando seu treino...</p>
      </div>
    );
  }

  // Estado de Descanso (Sem treino hoje)
  if (!treinoDoDia || treinoDoDia.totalExercicios === 0) {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans">
            <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-300">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Coffee size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Descanso Merecido!</h1>
                    <p className="text-gray-500 leading-relaxed">
                        Hoje é <strong>{treinoDoDia?.hojeString}</strong> e não há treinos programados. Aproveite para recuperar a musculatura, hidratar-se e manter a dieta.
                    </p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER HERO */}
        <div className="bg-gray-900 rounded-[2rem] p-6 md:p-10 shadow-2xl text-white relative overflow-hidden">
           {/* Efeitos de Fundo */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
           
           <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold uppercase tracking-wider text-xs">
                    <CalendarCheck size={16} />
                    <span>{treinoDoDia.hojeString}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
                    Bom treino, <br className="md:hidden"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {usuario?.nome?.split(' ')[0] || "Aluno"}
                    </span>!
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium">
                    Foco total nos <strong className="text-white">{treinoDoDia.totalExercicios} exercícios</strong> de hoje.
                </p>
           </div>
        </div>

        {/* LISTA DE EXERCÍCIOS (FEED / GRID) */}
        <div className="space-y-10">
            {Object.keys(treinoDoDia.categorias).map((categoria) => (
                <div key={categoria} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Título da Categoria (Se houver mais de uma, ajuda a organizar) */}
                    <div className="flex items-center gap-3 mb-5 px-1">
                         <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                         <h2 className="text-xl font-bold text-gray-800 capitalize">{categoria}</h2>
                    </div>
                    
                    {/* GRID Responsivo: 1 coluna no mobile (feed), 2 no tablet, 3 no desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {treinoDoDia.categorias[categoria].map((exercicio, index) => (
                            <ExercicioCard
                                key={exercicio.id || index}
                                item={exercicio}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Footerzinho Motivacional */}
        <div className="text-center py-8 opacity-50">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Treinei.Fit • Keep Moving</p>
        </div>

      </div>
    </div>
  );
}