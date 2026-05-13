import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/registrar', { nome, email, senha });
      alert('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (error) {
      alert('Erro ao criar conta.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 items-center justify-center font-sans">
      <form onSubmit={handleCadastro} className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-96 space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Criar Conta Grão</h2>
        
        <input type="text" placeholder="Seu Nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4">
          Cadastrar
        </button>
        
        <p className="text-gray-400 text-sm mt-4 text-center">
          Já tem conta? <Link to="/login" className="text-blue-400 hover:text-blue-300">Faça login aqui</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;