import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carrosel from "../../components/Carrosel";
import { TrainerDashboard } from "../TrainerLoginHome";
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  Code2,
  Database,
  ChevronRight,
  ChevronLeft,
  Quote,
  User,
  X,
  CircleCheck, // Atualizado de CheckCircle2
  Users,
  Zap,
  MonitorPlay,
  Search,
  MessageCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  CircleHelp, // Atualizado de HelpCircle
  Check,
  CircleX, // Atualizado de XCircle
  Activity, // Usando Activity nativo
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  
  // ESTADO PARA VERIFICAR LOGIN (Adapte para sua lógica real de Auth)
  const [isTrainerLoggedIn, setIsTrainerLoggedIn] = useState(false);

  useEffect(() => {
     // Exemplo: Verificar se existe token no localStorage
     const token = localStorage.getItem('trainer_token'); // Use sua chave real
     if (token) {
        setIsTrainerLoggedIn(true);
     }
  }, []);

  // --- LÓGICA DE DECISÃO ---
  // Se estiver logado, retorna o Dashboard direto, ignorando a Landing Page
  if (isTrainerLoggedIn) {
      return <TrainerDashboard />;
  }

  // Se NÃO estiver logado, continua executando o código da Landing Page abaixo...
  // ... (Cole aqui todo o restante do código da LandingPage original:
  // scrollToSection, testimonialsData, return da Landing Page, etc.)
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- DADOS DOS TESTEMUNHOS (Expandido) ---
  // --- DADOS DOS TESTEMUNHOS (Expandido e Diversificado) ---
  const testimonialsData = [
    {
      name: "Ricardo M.",
      role: "Aluno • Perdeu 6kg",
      text: "Eu nunca sabia o que fazer na academia. Com o Treinei.Fit, meu treinador manda tudo e o WhatsApp me cobra. Resultado real em 90 dias.",
      stars: 5,
    },
    {
      name: "Carla S.",
      role: "Personal Trainer",
      text: "A automação do WhatsApp mudou minha vida. Antes eu perdia horas mandando mensagens. Agora o sistema faz isso e eu foco em montar treinos e vender.",
      stars: 5,
    },
    {
      name: "Felipe J.",
      role: "Aluno Iniciante",
      text: "Os vídeos de execução salvam demais! Não preciso ficar chamando o instrutor toda hora. Me sinto muito mais seguro treinando sozinho.",
      stars: 5,
    },
    {
      name: "Academia Ironworks",
      role: "Gestão de Academia",
      text: "Implementamos para nossos personais e a retenção dos alunos aumentou 40%. O aluno se sente cuidado 24h por dia e renova o plano.",
      stars: 5,
    },
    {
      name: "Dra. Juliana R.",
      role: "Nutricionista Esportiva",
      text: "A integração da dieta com o treino é perfeita. Meu paciente recebe o cardápio no mesmo lugar do treino. A adesão ao plano alimentar melhorou muito.",
      stars: 5,
    },
    {
      name: "Marcos 'Tank'",
      role: "Bodybuilder",
      text: "Para quem treina sério, o histórico de cargas é essencial. O gráfico de evolução me ajuda a ajustar a intensidade semana a semana para não estagnar.",
      stars: 5,
    },
    {
      name: "Beatriz L.",
      role: "Mãe e Empresária",
      text: "Minha vida é corrida. O 'Agente Treinei' me manda o treino exato na hora que chego na academia. Não perco tempo pensando, só executo.",
      stars: 5,
    },
    {
      name: "Coach Fernando",
      role: "Consultoria Online",
      text: "Viajo o mundo trabalhando. A plataforma entrega os treinos para meus alunos no Brasil automaticamente. Escalabilidade total para minha consultoria.",
      stars: 5,
    },
    {
      name: "Sr. Antônio",
      role: "Melhor Idade",
      text: "Tinha medo de me machucar, mas meu treinador colocou vídeos bem explicativos. Consigo acompanhar tudo pelo celular sem letras miúdas.",
      stars: 5,
    },
    {
      name: "Studio Pilates & Funcional",
      role: "Studio Fitness",
      text: "A organização das turmas e a facilidade de replicar treinos para grupos nos poupou horas de trabalho administrativo.",
      stars: 5,
    },
    {
      name: "Larissa K.",
      role: "Atleta de Crossfit",
      text: "O comparativo de PRs (Recordes Pessoais) é incrível. Consigo ver minha evolução de força nos últimos 6 meses num gráfico simples.",
      stars: 5,
    },
    {
      name: "Dr. Paulo G.",
      role: "Fisioterapeuta",
      text: "Uso para passar exercícios de reabilitação. Consigo monitorar se o paciente está fazendo os exercícios em casa através dos check-ins.",
      stars: 5,
    },
  ];

  // --- COMPONENTE DO CARROSSEL ---
  const TestimonialCarousel = () => { // Quantidade de cards por página (desktop)
  const itemsPerPage = 3;

  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(testimonialsData.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Botão Anterior (Desktop) */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition border border-gray-100 hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Botão Próximo (Desktop) */}
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition border border-gray-100 hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      {/* Área do Slider */}
      <div className="overflow-hidden py-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {/* Cada "página" */}
          {[...Array(totalPages)].map((_, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0 flex">
              {testimonialsData
                .slice(
                  pageIndex * itemsPerPage,
                  pageIndex * itemsPerPage + itemsPerPage
                )
                .map((t, idx) => (
                  <div
                    key={idx}
                    className="w-full md:w-1/2 lg:w-1/3 px-3"
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full flex flex-col relative group">
                      {/* Ícone Decorativo */}
                      <div className="absolute top-6 right-6 text-gray-100 group-hover:text-blue-50 transition-colors sm:opacity-100 opacity-0">
                        <Quote size={40} fill="currentColor" />
                      </div>

                      {/* Estrelas */}
                      <div className="flex gap-1 text-yellow-400 mb-4">
                        {[...Array(t.stars)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      {/* Texto */}
                      <p className="text-gray-600 mb-6 italic flex-grow relative z-10">
                        "{t.text}"
                      </p>

                      {/* Rodapé */}
                      <div className="border-t border-gray-100 pt-4 mt-auto">
                        <p className="font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentPage === index
                ? "bg-blue-600 w-8"
                : "bg-gray-300 w-2.5 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Botões Mobile */}
      <div className="flex justify-between mt-6 md:hidden px-4">
        <button
          onClick={prevSlide}
          className="p-3 bg-white rounded-full shadow border border-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 bg-white rounded-full shadow border border-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

  const faqs = [
    {
      q: "Preciso pagar para me cadastrar como aluno?",
      a: "Não! O cadastro é gratuito. Você só paga se contratar a consultoria de um treinador específico.",
    },
    {
      q: "Como funciona o Agente WhatsApp?",
      a: "É automático. Assim que seu treino é montado, nosso sistema envia a ficha, vídeos e lembretes direto no seu Zap, sem você instalar nada.",
    },
    {
      q: "Sou treinador, tem teste grátis?",
      a: "Sim! Oferecemos 7 dias de garantia incondicional para você testar todas as ferramentas de gestão.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[750px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Gym Focus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-20 flex flex-col md:flex-row items-center justify-between max-w-7xl">
          <div className="md:w-3/5 space-y-8 animate-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm text-blue-200 font-medium mb-2">
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </span>
              <span>+1.500 treinos concluídos este mês</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Dobre seus resultados <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                sem a confusão.
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
              A única plataforma que une{" "}
              <strong>Treino, Dieta e Automação via WhatsApp</strong>. Pare de
              adivinhar o que fazer na academia. Tenha um especialista no seu
              bolso 24h.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => setShowLoginOptions(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                Quero Começar Agora <ArrowRight size={20} />
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="px-8 py-4 rounded-xl text-lg font-bold text-white border border-white/30 hover:bg-white/10 transition flex items-center justify-center"
              >
                Ver como funciona
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <CircleCheck size={18} className="text-green-400" /> Consultoria
                Online
              </span>
              <span className="flex items-center gap-2">
                <CircleCheck size={18} className="text-green-400" /> Personal
                Presencial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK (TECNOLOGIAS) --- */}
      <div className="py-10 bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
            Potencializado por tecnologias modernas
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20">
            {/* Item 1: React */}
            <div className="group flex items-center gap-3 text-gray-500 hover:text-blue-500 transition-colors duration-300 cursor-default">
              <Code2
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-lg font-bold tracking-tight">REACT.JS</span>
            </div>

            {/* Item 2: Automação */}
            <div className="group flex items-center gap-3 text-gray-500 hover:text-pink-500 transition-colors duration-300 cursor-default">
              <Zap
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-lg font-bold tracking-tight">N8N AUTO</span>
            </div>

            {/* Item 3: Banco de Dados */}
            <div className="group flex items-center gap-3 text-gray-500 hover:text-indigo-500 transition-colors duration-300 cursor-default">
              <Database
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-lg font-bold tracking-tight">MARIADB</span>
            </div>

            {/* Item 4: Integração */}
            <div className="group flex items-center gap-3 text-gray-500 hover:text-green-500 transition-colors duration-300 cursor-default">
              <MessageCircle
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-lg font-bold tracking-tight">
                WHATSAPP API
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROBLEMA VS SOLUÇÃO --- */}
      <section className="py-24 bg-white" id="como-funciona">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que a maioria desiste em 3 meses?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A falta de orientação e a complexidade de planilhas e apps
              genéricos matam seu progresso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* O Jeito Antigo */}
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                <CircleX /> O Jeito Antigo
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-red-900/70">
                  <X size={20} className="shrink-0 mt-1" /> Fichas de papel
                  amassadas que somem.
                </li>
                <li className="flex items-start gap-3 text-red-900/70">
                  <X size={20} className="shrink-0 mt-1" /> Apps complexos
                  cheios de anúncios.
                </li>
                <li className="flex items-start gap-3 text-red-900/70">
                  <X size={20} className="shrink-0 mt-1" /> Você nunca sabe se
                  está fazendo o exercício certo.
                </li>
              </ul>
            </div>

            {/* O Jeito Treinei.Fit */}
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <CircleCheck /> O Jeito Treinei.Fit
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-green-900/80 font-medium">
                  <Check size={20} className="shrink-0 mt-1 text-green-600" />{" "}
                  Tudo no seu WhatsApp (Treino e Vídeos).
                </li>
                <li className="flex items-start gap-3 text-green-900/80 font-medium">
                  <Check size={20} className="shrink-0 mt-1 text-green-600" />{" "}
                  Contato direto com seu Treinador.
                </li>
                <li className="flex items-start gap-3 text-green-900/80 font-medium">
                  <Check size={20} className="shrink-0 mt-1 text-green-600" />{" "}
                  Feedback visual de execução imediato.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- O DIFERENCIAL (N8N) --- */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 md:order-1">
            <div className="inline-block bg-purple-900/50 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Zap size={16} className="inline mr-2" /> Tecnologia Exclusiva N8N
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              O Treino que <br />{" "}
              <span className="text-green-400">Conversa com Você.</span>
            </h3>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Esqueça login e senha toda hora. Nosso{" "}
              <strong>Agente Inteligente</strong> envia sua rotina, vídeos e
              dieta proativamente no WhatsApp. É como ter um personal te
              cutucando para ir treinar.
            </p>

            <div className="space-y-6">
              <FeatureRow
                icon={<MessageCircle size={24} className="text-green-500" />}
                title="Lembretes Automáticos"
                desc="Receba o 'Bom dia' com o treino exato que você deve fazer hoje."
              />
              <FeatureRow
                icon={<MonitorPlay size={24} className="text-blue-500" />}
                title="Biblioteca de Vídeos Instantânea"
                desc="Dúvida na execução? O vídeo chega no seu chat em segundos."
              />
              <FeatureRow
                icon={<Utensils size={24} className="text-orange-500" />}
                title="Dieta na Palma da Mão"
                desc="Sua lista de alimentos e substituições sempre acessível."
              />
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gray-800 p-4 rounded-[2.5rem] border-8 border-gray-700 shadow-2xl w-full max-w-[300px]">
                <div className="h-[500px] bg-gray-900 rounded-2xl flex items-center justify-center text-gray-600">
                  <MessageCircle size={48} />
                  <p className="ml-2 m-5">Envie Sua Pergunta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PARA O TREINADOR --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">
              Área do Profissional
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Escale sua Consultoria
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCard
              icon={<Dumbbell size={28} className="text-blue-600" />}
              title="Crie Treinos em Minutos"
              desc="Interface arrasta-e-solta com biblioteca de vídeos pronta."
            />
            <ToolCard
              icon={<Users size={28} className="text-green-600" />}
              title="Gestão de Alunos"
              desc="Veja quem treinou, quem faltou e o progresso de carga."
            />
            <ToolCard
              icon={<Zap size={28} className="text-purple-600" />}
              title="Automação de Envio"
              desc="O robô entrega o treino por você. Zero trabalho manual diário."
            />
            <ToolCard
              icon={<ShieldCheck size={28} className="text-orange-600" />}
              title="Pagamentos Seguros"
              desc="Gerencie as mensalidades dos seus alunos em um só lugar."
            />
          </div>

          <div className="text-center mt-12 bg-blue-50 p-8 rounded-3xl max-w-3xl mx-auto border border-blue-100">
            <h4 className="text-xl font-bold text-blue-900 mb-2">
              Você é Personal Trainer?
            </h4>
            <p className="text-blue-700 mb-6">
              Teste todas as ferramentas de gestão e automação gratuitamente.
            </p>
            <button
              onClick={() => navigate("/auth-treinador")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-lg font-bold transition flex items-center gap-2 mx-auto shadow-lg shadow-blue-200"
            >
              Cadastrar Consultoria <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- PROVA SOCIAL (CARROSSEL) --- */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quem usa, recomenda
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Junte-se a centenas de alunos e profissionais que transformaram
              seus resultados.
            </p>
          </div>
          {/* Componente de Carrossel Interno */}
          <Carrosel testimonialsData={testimonialsData} />
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
              >
                <h4 className="font-bold text-gray-900 flex items-center gap-3 mb-2">
                  <CircleHelp size={20} className="text-blue-500" /> {f.q}
                </h4>
                <p className="text-gray-600 ml-8">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Comece sua evolução hoje.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLoginOptions(true)}
              className="bg-white text-blue-700 px-10 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl"
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-2xl text-white mb-2">
              Treinei<span className="text-blue-500">.Fit</span>
            </h4>
            <p>Tecnologia e Performance.</p>
          </div>
          <p>© {new Date().getFullYear()} Treinei Fitness.</p>
        </div>
      </footer>

      {/* --- MODAL LOGIN --- */}
      {showLoginOptions && (
        <div
          className="fixed inset-0 z-[60] backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowLoginOptions(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginOptions(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Bem-vindo ao Treinei.Fit
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Como você deseja acessar?
            </p>

            <div className="space-y-4">
              <LoginOptionButton
                icon={<User size={24} />}
                colorClass="blue"
                title="Sou Aluno"
                desc="Acessar meus treinos e dieta"
                onClick={() => {
                  navigate("/auth-usuario");
                  setShowLoginOptions(false);
                }}
              />

              <LoginOptionButton
                icon={<Dumbbell size={24} />}
                colorClass="orange"
                title="Sou Treinador"
                desc="Gerenciar alunos e consultoria"
                onClick={() => {
                  navigate("/auth-treinador");
                  setShowLoginOptions(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTES ---

const FeatureRow = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="bg-gray-800 p-2 rounded-lg mt-1 border border-gray-700">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white text-lg">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ToolCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-white hover:shadow-xl transition-all duration-300 group">
    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h4 className="font-bold text-xl mb-3 text-gray-900">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const LoginOptionButton = ({ icon, colorClass, title, desc, onClick }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600",
    orange:
      "bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-600 hover:text-white hover:border-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full group flex items-center p-4 border rounded-2xl transition-all duration-200 hover:shadow-lg bg-white border-gray-200 hover:border-transparent`}
    >
      <div
        className={`p-4 rounded-xl mr-5 transition-colors duration-200 ${
          colors[colorClass].split(" hover")[0]
        } group-hover:bg-opacity-20`}
      >
        {icon}
      </div>
      <div className="text-left flex-1">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <ChevronRight className="text-gray-300 group-hover:text-gray-600" />
    </button>
  );
};

export default LandingPage;
