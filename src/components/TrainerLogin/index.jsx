import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
// Importe a função do seu arquivo de serviços
import { registerTrainer, esqueciSenhaTreinador } from "../../services/Treinador/authService";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  Dumbbell, 
  AlertCircle,
  CheckCircle,
  KeyRound
} from "lucide-react";

// --- COMPONENTE INPUTFIELD ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
      <Icon size={20} />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400"
    />
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const TrainerAuth = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  
  // Modos de visualização
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Novo estado

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Novo estado para sucesso
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Função para alternar modos e limpar mensagens
  const switchMode = (mode) => {
    setError("");
    setSuccess("");
    if (mode === 'login') {
      setIsLogin(true);
      setIsForgotPassword(false);
    } else if (mode === 'register') {
      setIsLogin(false);
      setIsForgotPassword(false);
    } else if (mode === 'forgot') {
      setIsForgotPassword(true);
    }
  };

  // Handler de Login e Cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        // Redirect handled by useEffect
      } else {
        await registerTrainer(nome, email, password);
        alert("✅ Conta criada com sucesso! Entrando...");
        setIsLogin(true);
        setNome(""); 
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Falha na operação. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  // Handler de Recuperação de Senha
  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await esqueciSenhaTreinador(email);
      setSuccess("Link de recuperação enviado para o seu email.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Não foi possível enviar o email.");
    } finally {
      setLoading(false);
    }
  };

  // Configuração Dinâmica do Cabeçalho
  let headerTitle = "Bem-vindo de volta";
  let headerSubtitle = "Acesse seu painel de treinador";
  let HeaderIcon = Dumbbell;

  if (isForgotPassword) {
    headerTitle = "Recuperar Acesso";
    headerSubtitle = "Receba o link para redefinir sua senha";
    HeaderIcon = KeyRound;
  } else if (!isLogin) {
    headerTitle = "Junte-se ao time";
    headerSubtitle = "Crie sua conta e gerencie alunos";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4 font-sans">
      {/* Container Principal */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Detalhe Decorativo Superior */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

        <div className="p-8 md:p-10">
          
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full text-blue-600 mb-4 shadow-sm animate-in zoom-in duration-300">
              <HeaderIcon size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {headerTitle}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {headerSubtitle}
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* --- TELA DE RECUPERAÇÃO --- */}
          {isForgotPassword ? (
             <form onSubmit={handleRecoverySubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Cadastrado</label>
                  <InputField 
                    icon={Mail} 
                    type="email" 
                    placeholder="nome@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Link
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full bg-transparent hover:bg-gray-50 text-gray-600 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ArrowLeft size={18} />
                  Voltar para o Login
                </button>
             </form>
          ) : (

          /* --- TELA DE LOGIN / CADASTRO --- */
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nome Completo</label>
                <InputField 
                  icon={User} 
                  type="text" 
                  placeholder="Ex: João Silva" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                />
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-75">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Profissional</label>
              <InputField 
                icon={Mail} 
                type="email" 
                placeholder="nome@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
               <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isLogin ? "Entrar na Plataforma" : "Criar Conta Grátis"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          )}

          {/* Rodapé do Card (Esconde na recuperação) */}
          {!isForgotPassword && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Não tem uma conta?" : "Já possui cadastro?"}{" "}
                <button
                  onClick={() => switchMode(isLogin ? 'register' : 'login')}
                  className="text-blue-600 font-bold hover:text-blue-800 transition-colors inline-flex items-center gap-1 group"
                >
                  {isLogin ? "Registre-se agora" : "Fazer Login"}
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Copyright Discreto */}
        <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
           <p className="text-xs text-gray-400">
             Treinei Fitness © {new Date().getFullYear()} • Área do Treinador
           </p>
        </div>

      </div>
    </div>
  );
};

export default TrainerAuth;