import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Tags, Settings, LogOut, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

function Categorias() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('grao_token');
    const userStorage = localStorage.getItem('grao_usuario');
    if (!token || !userStorage) {
      navigate('/login');
    } else {
      setUsuario(JSON.parse(userStorage));
      buscarCategorias();
    }
  }, [navigate]);

  const buscarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    }
  };

  const handleCriarCategoria = async (e) => {
    e.preventDefault();
    if (!novaCategoria.trim()) return;
    
    setCarregando(true);
    try {
      await api.post('/categorias', { nome: novaCategoria });
      setNovaCategoria('');
      buscarCategorias(); // Atualiza a lista
    } catch (error) {
      alert('Erro ao criar categoria.');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirCategoria = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await api.delete(`/categorias/${id}`);
        buscarCategorias();
      } catch (error) {
        alert('Erro ao excluir. Pode ser que existam lançamentos atrelados a ela.');
      }
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
          {/* Note que agora o Visão Geral não está azul, mas sim a guia Categorias */}
          <button onClick={() => navigate('/dashboard')} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Visão Geral
          </button>
          <button className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Lançamentos
          </button>
          <button className="flex items-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg transition">
            <Tags className="w-5 h-5 mr-3" /> Categorias
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
          <h2 className="text-2xl font-semibold">Minhas Categorias</h2>
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
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* FORMULÁRIO DE NOVA CATEGORIA */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-medium mb-4">Adicionar Nova Categoria</h3>
              <form onSubmit={handleCriarCategoria} className="flex gap-4">
                <input 
                  type="text" 
                  value={novaCategoria} 
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Ex: Marketing, Transporte..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button 
                  type="submit" 
                  disabled={carregando}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition"
                >
                  <Plus className="w-5 h-5" /> {carregando ? 'Salvando...' : 'Adicionar'}
                </button>
              </form>
            </div>

            {/* LISTA DE CATEGORIAS */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold">Categorias Cadastradas</h3>
              </div>
              <div className="p-0">
                {categorias.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhuma categoria encontrada.</div>
                ) : (
                  <ul className="divide-y divide-gray-700">
                    {categorias.map((cat) => (
                      <li key={cat.id} className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition group">
                        <span className="text-gray-200">{cat.nome}</span>
                        <button 
                          onClick={() => handleExcluirCategoria(cat.id)}
                          className="text-gray-500 hover:text-red-500 transition opacity-50 group-hover:opacity-100"
                          title="Excluir Categoria"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Categorias;