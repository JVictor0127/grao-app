import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // <-- 1. Importando nosso comunicador

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); // <-- 2. Estado para avisar se a senha errar
  const [carregando, setCarregando] = useState(false); // <-- 3. Estado de carregamento
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); // Limpa o erro ao tentar de novo
    setCarregando(true); // Muda o botão para "Entrando..."

    try {
      // 4. Manda o e-mail e senha pro nosso backend
      const response = await api.post('/auth/login', { email, senha });
      
      // 5. Deu certo? Salva o Token e os dados do usuário no navegador (Local Storage)
      localStorage.setItem('grao_token', response.data.token);
      localStorage.setItem('grao_usuario', JSON.stringify(response.data.usuario));

      // 6. Abre as portas e manda pro Dashboard!
      navigate('/dashboard'); 
      
    } catch (error) {
      // Se deu erro (ex: 401 Senha incorreta), mostramos na tela
      if (error.response && error.response.data.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro de conexão. O servidor Node.js está ligado?');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Grão</h1>
          <p className="text-gray-400">Controle financeiro inteligente</p>
        </div>

        {/* Caixinha de Erro: Só aparece se houver alguma mensagem de erro */}
        {erro && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <button 
            onClick={() => navigate('/cadastro')}
            className="text-blue-500 hover:text-blue-400 font-semibold"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;