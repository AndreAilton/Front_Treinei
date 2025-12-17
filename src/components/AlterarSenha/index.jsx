import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { resetarSenhaUsuario } from '../../services/Usuario/usuarioAuthService'
import  { resetarSenhaTreinador } from '../../services/Treinador/authService'


export default function ResetPassword() {
  const { token } = useParams(); // Pega o token da URL da rota
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pega o email da query string (?email=...)
  const emailFromUrl = searchParams.get('email');
  const verifytrainer = searchParams.get('trainer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Validação de segurança: se não tiver email na URL, bloqueia
  if (!emailFromUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Link Inválido</h2>
          <p className="mt-2 text-gray-600">
            Link incompleto. Por favor, solicite uma nova recuperação de senha.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);

    try {
      // --- AQUI ESTÁ A MUDANÇA ---
      // Usamos sua função helper ao invés do axios direto
      console.log("verifytrainer:", verifytrainer); 
      if (verifytrainer) {
        await resetarSenhaTreinador(emailFromUrl, token, password);
        setStatus({ type: 'success', message: 'Senha atualizada com sucesso!' });
      } else {
        await resetarSenhaUsuario(emailFromUrl, token, password);
        setStatus({ type: 'success', message: 'Senha atualizada com sucesso!' });
      }
        // Redireciona após 3 segundos
        setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      // Sua função helper já extrai a mensagem de erro, então usamos error.message
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4">
            <KeyRound className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Nova Senha</h2>
          <p className="mt-2 text-sm text-gray-500">
            Defina uma nova senha para:
          </p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
            {emailFromUrl}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Campo: Nova Senha */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nova Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Campo: Confirmar Senha */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {status.message && (
            <div className={`rounded-md p-4 flex items-start ${status.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex-shrink-0">
                {status.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {status.message}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Atualizando...
              </>
            ) : (
              'Redefinir Senha'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}