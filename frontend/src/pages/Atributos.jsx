import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, FolderOpen, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

function Atributos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  
  // Estados de Categorias
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [carregandoCat, setCarregandoCat] = useState(false);

  // Estados de Beneficiários
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [novoBeneficiario, setNovoBeneficiario] = useState('');
  const [carregandoBen, setCarregandoBen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('grao_token');
    const userStorage = localStorage.getItem('grao_usuario');
    if (!token || !userStorage) {
      navigate('/login');
    } else {
      setUsuario(JSON.parse(userStorage));
      buscarDados();
    }
  }, [navigate]);

  const buscarDados = async () => {
    try {
      const [resCat, resBen] = await Promise.all([
        api.get('/categorias'),
        api.get('/beneficiarios')
      ]);
      setCategorias(resCat.data);
      setBeneficiarios(resBen.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    }
  };

  // Funções de Categoria
  const handleCriarCategoria = async (e) => {
    e.preventDefault();
    if (!novaCategoria.trim()) return;
    setCarregandoCat(true);
    try {
      await api.post('/categorias', { nome: novaCategoria });
      setNovaCategoria('');
      buscarDados();
    } catch (error) { alert('Erro ao criar categoria.'); } 
    finally { setCarregandoCat(false); }
  };

  const handleExcluirCategoria = async (id) => {
    if (window.confirm("Excluir esta categoria?")) {
      try { await api.delete(`/categorias/${id}`); buscarDados(); } 
      catch (error) { alert('Erro ao excluir. Pode estar em uso.'); }
    }
  };

  // Funções de Beneficiário
  const handleCriarBeneficiario = async (e) => {
    e.preventDefault();
    if (!novoBeneficiario.trim()) return;
    setCarregandoBen(true);
    try {
      await api.post('/beneficiarios', { nome: novoBeneficiario });
      setNovoBeneficiario('');
      buscarDados();
    } catch (error) { alert('Erro ao criar beneficiário.'); } 
    finally { setCarregandoBen(false); }
  };

  const handleExcluirBeneficiario = async (id) => {
    if (window.confirm("Excluir este beneficiário?")) {
      try { await api.delete(`/beneficiarios/${id}`); buscarDados(); } 
      catch (error) { alert('Erro ao excluir. Pode estar em uso.'); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('grao_token');
    localStorage.removeItem('grao_usuario');
    navigate('/login');
  };

  if (!usuario) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col hidden md:flex">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-blue-500">Grão</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Visão Geral
          </button>
          <button onClick={() => navigate('/lancamentos')} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Lançamentos
          </button>
          
          {/* Menu atualizado para Cadastros com ícone de Pasta */}
          <button onClick={() => navigate('/atributos')} 
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <FolderOpen className="w-5 h-5 mr-3" /> Atributos
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <Settings className="w-5 h-5 mr-3" /> Configurações
          </button>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition mt-2">
            <LogOut className="w-5 h-5 mr-3" /> Sair
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-2xl font-semibold">Central de Cadastros</h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-400">Bem-vindo(a),</p>
              <p className="font-medium">{usuario.nome}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLUNA 1: CATEGORIAS */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-blue-400">Nova Categoria</h3>
                <form onSubmit={handleCriarCategoria} className="flex gap-4">
                  <input type="text" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} placeholder="Ex: Marketing..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required />
                  <button type="submit" disabled={carregandoCat} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/30"><h3 className="font-semibold">Categorias Salvas</h3></div>
                <ul className="divide-y divide-gray-700">
                  {categorias.map((cat) => (
                    <li key={cat.id} className="flex justify-between p-4 hover:bg-gray-700/50 transition group">
                      <span className="text-gray-200">{cat.nome}</span>
                      <button onClick={() => handleExcluirCategoria(cat.id)} className="text-gray-500 hover:text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* COLUNA 2: BENEFICIÁRIOS */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-emerald-400">Novo Beneficiário</h3>
                <form onSubmit={handleCriarBeneficiario} className="flex gap-4">
                  <input type="text" value={novoBeneficiario} onChange={(e) => setNovoBeneficiario(e.target.value)} placeholder="Ex: Fornecedor F5, João..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" required />
                  <button type="submit" disabled={carregandoBen} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition">
                    <Plus className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 bg-gray-900/30"><h3 className="font-semibold">Beneficiários Salvos</h3></div>
                <ul className="divide-y divide-gray-700">
                  {beneficiarios.map((ben) => (
                    <li key={ben.id} className="flex justify-between p-4 hover:bg-gray-700/50 transition group">
                      <span className="text-gray-200">{ben.nome}</span>
                      <button onClick={() => handleExcluirBeneficiario(ben.id)} className="text-gray-500 hover:text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Atributos;