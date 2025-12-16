import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { registerUsuario } from "../../services/Usuario/usuarioAuthService";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Loader2, 
  ArrowRight, 
  Activity, 
  AlertCircle 
} from "lucide-react";

// --- 1. COMPONENTE INPUTFIELD MOVIDO PARA FORA (Correção do Bug) ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
      <Icon size={20} />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400"
    />
  </div>
);

// --- 2. COMPONENTE PRINCIPAL ---
const UsuarioAuth = () => {
  const { LoginUsuario, isAuthenticated, logout } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  
  // Estados do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de UI
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        logout(); // Garante logout de qualquer sessão anterior
        await LoginUsuario(email, password);
        navigate("/");
      } else {
        const usuarioData = { nome, telefone, email, password };
        await registerUsuario(usuarioData);
        alert("✅ Conta criada! Fazendo login...");
        
        setIsLogin(true);
        setNome("");
        setTelefone("");
        
        // Auto-login após cadastro
        await LoginUsuario(email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Ocorreu um erro. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Barra Decorativa Superior */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>

        <div className="p-8 md:p-10">
          
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full text-indigo-600 mb-4 shadow-sm animate-in zoom-in duration-300">
              <Activity size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? "Área do Aluno" : "Crie sua conta"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin 
                ? "Acompanhe seus treinos e evolução" 
                : "Comece sua jornada fitness hoje mesmo"}
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campos de Cadastro */}
            {!isLogin && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
                  <InputField 
                    icon={User} 
                    type="text" 
                    placeholder="Ex: Maria Souza" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Celular / WhatsApp</label>
                  <InputField 
                    icon={Phone} 
                    type="tel" 
                    placeholder="(11) 99999-9999" 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* Campos Comuns */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
              <InputField 
                icon={Mail} 
                type="email" 
                placeholder="seu@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
               <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                      Esqueceu a senha?
                    </a>
                  )}
               </div>
              <InputField 
                icon={Lock} 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {isLogin ? "Acessar Treinos" : "Cadastrar Gratuitamente"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Rodapé Toggle */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Novo por aqui?" : "Já tem cadastro?"}{" "}
              <button
                onClick={() => {
                  setError("");
                  setIsLogin(!isLogin);
                }}
                className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
              >
                {isLogin ? "Crie sua conta" : "Fazer Login"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
           <p className="text-xs text-gray-400">
             Treinei Fitness © {new Date().getFullYear()}
           </p>
        </div>

      </div>
    </div>
  );
};

export default UsuarioAuth;