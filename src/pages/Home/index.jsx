import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- IMPORTS DAS HOMES ---
import { TrainerDashboard } from "../TrainerLoginHome"; 
import UserLoginHome from "../UserLoginHome"; // <--- Importe o componente que criamos anteriormente aqui

import {
  Dumbbell,
  Utensils,
  Code2,
  Database,
  ChevronRight,
  ChevronLeft,
  Quote,
  User,
  X,
  CircleCheck,
  Users,
  Zap,
  MonitorPlay,
  MessageCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  CircleHelp,
  Check,
  CircleX,
  Loader2 
} from "lucide-react";

// --- DADOS E COMPONENTES AUXILIARES (Mantidos fora para performance) ---

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
  // ... (Outros testemunhos mantidos)
  {
    name: "Felipe J.",
    role: "Aluno Iniciante",
    text: "Os vídeos de execução salvam demais! Não preciso ficar chamando o instrutor toda hora. Me sinto muito mais seguro treinando sozinho.",
    stars: 5,
  },
];

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

const TestimonialCarousel = () => {
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
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition border border-gray-100 hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition border border-gray-100 hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      <div className="overflow-hidden py-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
          }}
        >
          {[...Array(totalPages)].map((_, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0 flex flex-col md:flex-row">
              {testimonialsData
                .slice(
                  pageIndex * itemsPerPage,
                  pageIndex * itemsPerPage + itemsPerPage
                )
                .map((t, idx) => (
                  <div
                    key={idx}
                    className="w-full md:w-1/3 px-3 mb-4 md:mb-0"
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full flex flex-col relative group">
                      <div className="absolute top-6 right-6 text-gray-100 group-hover:text-blue-50 transition-colors sm:opacity-100 opacity-0">
                        <Quote size={40} fill="currentColor" />
                      </div>

                      <div className="flex gap-1 text-yellow-400 mb-4">
                        {[...Array(t.stars)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      <p className="text-gray-600 mb-6 italic flex-grow relative z-10">
                        "{t.text}"
                      </p>

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
};


// --- COMPONENTE PRINCIPAL (LANDING PAGE) ---
const LandingPage = () => {
  const navigate = useNavigate();
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  
  // ESTADOS DE AUTENTICAÇÃO
  const [isTrainerLoggedIn, setIsTrainerLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // NOVO
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
     const checkAuth = () => {
        // Verifica token do TREINADOR
        const trainerToken = localStorage.getItem('trainer_token');
        
        // Verifica token do ALUNO (Ajuste a chave 'usuario_token' se o seu sistema usa outro nome)
        const userToken = localStorage.getItem('usuario_token'); 

        if (trainerToken) {
           setIsTrainerLoggedIn(true);
        } else if (userToken) {
           setIsUserLoggedIn(true);
        }

        setIsLoading(false);
     }
     checkAuth();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 1. Loading State
  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
      )
  }

  // 2. Redirecionamento se TREINADOR logado
  if (isTrainerLoggedIn) {
      return <TrainerDashboard />;
  }

  // 3. Redirecionamento se ALUNO logado (NOVO)
  if (isUserLoggedIn) {
      return <UserLoginHome />;
  }

  // 4. Renderização da Landing Page (Se ninguém estiver logado)
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
          </div>
        </div>
      </section>

      {/* --- RESTO DA LANDING PAGE (SEÇÕES DE MARKETING) --- */}
      {/* --- TECH STACK --- */}
      <div className="py-10 bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
            Potencializado por tecnologias modernas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20">
             {/* Ícones omitidos para brevidade, mas devem estar aqui igual ao código anterior */}
             <div className="group flex items-center gap-3 text-gray-500 hover:text-blue-500 transition-colors cursor-default">
                <Code2 size={28} /> <span className="text-lg font-bold tracking-tight">REACT.JS</span>
             </div>
             <div className="group flex items-center gap-3 text-gray-500 hover:text-pink-500 transition-colors cursor-default">
                <Zap size={28} /> <span className="text-lg font-bold tracking-tight">N8N AUTO</span>
             </div>
             <div className="group flex items-center gap-3 text-gray-500 hover:text-green-500 transition-colors cursor-default">
                <MessageCircle size={28} /> <span className="text-lg font-bold tracking-tight">WHATSAPP API</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- PROBLEMA VS SOLUÇÃO --- */}
      <section className="py-24 bg-white" id="como-funciona">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Cards Jeito Antigo vs Treinei.Fit mantidos aqui... */}
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
               <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2"><CircleX /> O Jeito Antigo</h3>
               <ul className="space-y-4 text-red-900/70">
                 <li className="flex gap-3"><X size={20}/> Fichas de papel amassadas.</li>
                 <li className="flex gap-3"><X size={20}/> Apps cheios de anúncios.</li>
               </ul>
            </div>
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 shadow-xl relative overflow-hidden">
               <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2"><CircleCheck /> O Jeito Treinei.Fit</h3>
               <ul className="space-y-4 text-green-900/80 font-medium">
                 <li className="flex gap-3"><Check size={20} className="text-green-600"/> Tudo no WhatsApp.</li>
                 <li className="flex gap-3"><Check size={20} className="text-green-600"/> Contato com Treinador.</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- AREA N8N --- */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
         {/* Seção escura mantida... */}
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="order-2 md:order-1">
               <h3 className="text-4xl font-extrabold text-white mb-6">O Treino que <span className="text-green-400">Conversa com Você.</span></h3>
               <div className="space-y-6">
                 <FeatureRow icon={<MessageCircle size={24} className="text-green-500"/>} title="Lembretes Automáticos" desc="Receba o 'Bom dia' com seu treino." />
                 <FeatureRow icon={<MonitorPlay size={24} className="text-blue-500"/>} title="Vídeos Instantâneos" desc="Dúvida? O vídeo chega no chat." />
               </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
               <div className="bg-gray-800 p-4 rounded-[2.5rem] border-8 border-gray-700 shadow-2xl w-full max-w-[300px] h-[500px] flex items-center justify-center">
                  <MessageCircle size={48} className="text-gray-600" />
               </div>
            </div>
         </div>
      </section>

      {/* --- CARROSSEL --- */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quem usa, recomenda</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 flex items-center gap-3 mb-2"><CircleHelp size={20} className="text-blue-500" /> {f.q}</h4>
                <p className="text-gray-600 ml-8">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Bem-vindo ao Treinei.Fit</h2>
            <p className="text-center text-gray-500 mb-8">Como você deseja acessar?</p>

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

export default LandingPage;