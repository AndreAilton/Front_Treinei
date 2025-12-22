import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  Users, 
  Dumbbell, 
  ClipboardList, 
  Utensils, 
  TrendingUp, 
  Activity,
  Calendar,
  Loader2
} from "lucide-react";

// Importa os dois serviços
import { getdadosTreinador } from "../../services/Treinador/treinadorService"; 
import { getDietas } from "../../services/Treinador/dietasService"; // <--- NOVO IMPORT

const StatCard = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    {subtext && (
      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <TrendingUp size={12} className="text-green-500" /> {subtext}
      </p>
    )}
  </div>
);

export const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [treinadorNome, setTreinadorNome] = useState("Treinador");
  
  const [stats, setStats] = useState({
    alunos: 0,
    exercicios: 0,
    treinos: 0,
    dietas: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const carregarDadosGerais = async () => {
      setLoading(true);
      try {
        // Busca dados do treinador E das dietas em paralelo
        const [treinadorData, dietasData] = await Promise.all([
            getdadosTreinador(),
            getDietas()
        ]);
        
        console.log("Treinador:", treinadorData);
        console.log("Dietas:", dietasData);

        // Tratamento Treinador
        const dados = treinadorData?.treinador || treinadorData || {};

        if (dados.nome) {
            const nomeFormatado = dados.nome.includes("@") 
                ? dados.nome.split("@")[0] 
                : dados.nome;
            setTreinadorNome(nomeFormatado);
        }

        // Tratamento Dietas (garante que seja array)
        const listaDietas = Array.isArray(dietasData) ? dietasData : [];

        // Atualiza Stats unificando as fontes
        setStats({
          alunos: dados.usuarios_treino?.length || 0,
          exercicios: dados.exercicios?.length || 0,
          treinos: dados.treinos?.length || 0,
          dietas: listaDietas.length // <--- Agora pega do endpoint correto
        });

        // Lista Recente
        const ultimosAlunos = dados.usuarios_treino?.slice(0, 3) || [];
        setRecentStudents(ultimosAlunos);

      } catch (error) {
        console.error("Erro no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosGerais();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-500">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
                Olá, {treinadorNome}! 👋
            </h1>
            <p className="text-gray-500">Visão geral da sua performance.</p>
          </div>
        </div>

        {/* Grid de Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Alunos Ativos" 
            value={stats.alunos} 
            icon={<Users size={24} className="text-blue-600" />} 
            color="bg-blue-100"
            subtext="Total matriculado"
          />
          <StatCard 
            title="Exercícios" 
            value={stats.exercicios} 
            icon={<Dumbbell size={24} className="text-purple-600" />} 
            color="bg-purple-100"
            subtext="Na biblioteca"
          />
          <StatCard 
            title="Treinos" 
            value={stats.treinos} 
            icon={<ClipboardList size={24} className="text-green-600" />} 
            color="bg-green-100"
            subtext="Modelos criados"
          />
          <StatCard 
            title="Dietas" 
            value={stats.dietas} 
            icon={<Utensils size={24} className="text-orange-600" />} 
            color="bg-orange-100"
            subtext="Cadastradas"
          />
        </div>

        {/* Seção Secundária */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lista de Alunos Recentes */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500"/> Últimos Vínculos
                </h3>
                <div className="space-y-4">
                    {recentStudents.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Users size={32} className="mx-auto mb-2 opacity-50"/>
                            <p className="text-sm">Nenhum aluno vinculado ainda.</p>
                        </div>
                    ) : (
                        recentStudents.map((item, index) => (
                            <div key={item.id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                        {item.usuario?.nome?.substring(0, 2).toUpperCase() || "AL"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {item.usuario?.nome || "Aluno sem nome"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            Treino: <span className="font-medium text-blue-600">{item.treino?.nome || "Nenhum"}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium shrink-0">
                                    Ativo
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 mb-4">Acesso Rápido</h3>
                <div className="space-y-3">
                    
                    <button 
                        onClick={() => navigate("/vincular-treino-usuario")}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition text-gray-600 text-sm font-medium"
                    >
                        <Users size={18} /> Meus Alunos
                    </button>

                    <button 
                        onClick={() => navigate("/treinos")}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition text-gray-600 text-sm font-medium"
                    >
                        <Dumbbell size={18} /> Criar Treino
                    </button>

                    <button 
                        onClick={() => navigate("/dietas")}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition text-gray-600 text-sm font-medium"
                    >
                        <Utensils size={18} /> Ver Dietas
                    </button>
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};