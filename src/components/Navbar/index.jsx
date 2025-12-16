import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Menu, 
  X, 
  LogOut, 
  Dumbbell, 
  Users, 
  CalendarDays, 
  Utensils, 
  User, 
  Search, 
  Activity,
  LogIn
} from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber em qual rota estamos
  const auth = useContext(AuthContext);
  
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(auth?.tipo || null);

  // --- LÓGICA DE AUTH (Mantida Original) ---
  useEffect(() => {
    setRole(auth?.tipo || null);
  }, [auth?.tipo, auth?.token, auth?.user]);

  useEffect(() => {
    const onAuthChanged = () => {
      const trainerToken = localStorage.getItem("trainer_token");
      const usuarioToken = localStorage.getItem("usuario_token");

      if (trainerToken) setRole("trainer");
      else if (usuarioToken) setRole("usuario");
      else setRole(null);
    };

    const onStorage = (e) => {
      if (
        e.key === "trainer_token" ||
        e.key === "usuario_token" ||
        e.key === "trainer" ||
        e.key === "usuario" ||
        e.key === "__auth_last_change"
      ) {
        onAuthChanged();
      }
    };

    window.addEventListener("authChanged", onAuthChanged);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    navigate("/");
    setIsMobileMenuOpen(false); // Fecha menu mobile se aberto
    if (auth && auth.logout) auth.logout();
    else {
      localStorage.removeItem("trainer_token");
      localStorage.removeItem("usuario_token");
      localStorage.removeItem("trainer");
      localStorage.removeItem("usuario");
      setRole(null);
    }
  };

  // --- CONFIGURAÇÃO DOS LINKS ---
  // Isso facilita a manutenção e renderização mobile/desktop
  const userLinks = [
    { to: "/escolher-treinador", label: "Treinadores", icon: Search },
    { to: "/meu-treino", label: "Meu Treino", icon: Activity },
  ];

  const trainerLinks = [
    { to: "/exercicios", label: "Exercícios", icon: Dumbbell },
    { to: "/treinos", label: "Gerenciar Treinos", icon: Activity },
    { to: "/vincular-treino-usuario", label: "Alunos", icon: Users },
    { to: "/treino-dias", label: "Agenda", icon: CalendarDays },
    { to: "/dietas", label: "Dietas", icon: Utensils },
  ];

  // Componente auxiliar para renderizar links
  const NavLinkItem = ({ to, label, icon: Icon, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm
          ${isActive 
            ? "bg-blue-50 text-blue-600 shadow-sm" 
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
          }`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Header Fixo com efeito de vidro */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LOGO */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2 group-hover:bg-blue-700 transition">
                <Dumbbell className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Treinei<span className="text-blue-600">.Fit</span>
              </h1>
            </div>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center space-x-1">
              {role === "usuario" && userLinks.map((link) => (
                <NavLinkItem key={link.to} {...link} />
              ))}
              
              {role === "trainer" && trainerLinks.map((link) => (
                <NavLinkItem key={link.to} {...link} />
              ))}
            </nav>

            {/* DESKTOP ACTIONS (Login/Logout) */}
            <div className="hidden md:flex items-center gap-3">
              {role ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginOptions(true)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <User size={18} />
                  Entrar
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-md focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 animate-in slide-in-from-top-5 fade-in duration-200 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Menu {role === 'trainer' ? 'Treinador' : role === 'usuario' ? 'Aluno' : 'Principal'}
              </p>
              
              {role === "usuario" && userLinks.map((link) => (
                <NavLinkItem key={link.to} {...link} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              
              {role === "trainer" && trainerLinks.map((link) => (
                <NavLinkItem key={link.to} {...link} onClick={() => setIsMobileMenuOpen(false)} />
              ))}

              <div className="border-t border-gray-100 my-2 pt-2">
                {role ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut size={18} /> Sair
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLoginOptions(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    <LogIn size={18} /> Fazer Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODAL DE LOGIN (Overlay) */}
      {showLoginOptions && (
        <div
          className="fixed inset-0 z-[60] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLoginOptions(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full transform transition-all scale-100 border border-gray-100"
            onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Acessar conta</h2>
              <button 
                onClick={() => setShowLoginOptions(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                    navigate("/auth-usuario");
                    setShowLoginOptions(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition shadow-blue-200 shadow-lg"
              >
                <User size={20} />
                Sou Aluno
              </button>

              <button
                onClick={() => {
                    navigate("/auth-treinador");
                    setShowLoginOptions(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition shadow-lg"
              >
                <Dumbbell size={20} />
                Sou Treinador
              </button>
            </div>
            
            <p className="mt-6 text-center text-xs text-gray-400">
              Ainda não tem conta? Selecione uma opção acima para criar.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;