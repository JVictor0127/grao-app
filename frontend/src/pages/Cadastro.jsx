import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Manda os dados do formulário para o Node.js
      await api.post('/auth/cadastro', { nome, apelido, email, senha });
      
      // Deu certo! Mostra um aviso rápido e joga o usuário para a tela de Login
      alert('Conta criada com sucesso! Faça o login para acessar.');
      navigate('/login');
      
    } catch (error) {
      if (error.response && error.response.data.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro de conexão com o servidor.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-8">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Criar Conta</h1>
          <p className="text-gray-400">Junte-se ao Grão e controle suas finanças</p>
        </div>

        {erro && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Como quer ser chamado?</label>
            <input 
              type="text" 
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: João"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            {carregando ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-400 font-semibold"
          >
            Faça login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;