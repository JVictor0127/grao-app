import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, FolderOpen, Settings, LogOut, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';

function Lancamentos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados para os filtros
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'receita' ou 'despesa'

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
      const response = await api.get('/movimentacoes');
      setMovimentacoes(response.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirLancamento = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        await api.delete(`/movimentacoes/${id}`);
        buscarDados(); // Recarrega a lista
      } catch (error) {
        alert('Erro ao excluir o lançamento.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('grao_token');
    localStorage.removeItem('grao_usuario');
    navigate('/login');
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // --- LÓGICA DE FILTRAGEM ---
  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    // Verifica se a descrição inclui o que foi digitado na busca
    const matchBusca = mov.descricao.toLowerCase().includes(busca.toLowerCase());
    // Verifica se o tipo bate com o filtro selecionado
    const matchTipo = filtroTipo === 'todos' || mov.tipo === filtroTipo;
    
    return matchBusca && matchTipo;
  });

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
          
          {/* Lançamentos agora é o item ativo (Azul) */}
          <button className="flex items-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg transition">
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Lançamentos
          </button>
          
          <button onClick={() => navigate('/atributos')} className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <FolderOpen className="w-5 h-5 mr-3"/> Atributos
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
          <h2 className="text-2xl font-semibold">Histórico de Lançamentos</h2>
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
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* BARRA DE FILTROS */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Campo de Busca */}
              <div className="relative w-full sm:w-96">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar lançamento..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Filtro de Tipo */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-5 h-5 text-gray-400" />
                <select 
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer w-full"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="receita">Apenas Receitas</option>
                  <option value="despesa">Apenas Despesas</option>
                </select>
              </div>

            </div>

            {/* TABELA DE LANÇAMENTOS */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-0 overflow-x-auto">
                {carregando ? (
                  <div className="p-8 text-center text-gray-500">Carregando lançamentos...</div>
                ) : movimentacoesFiltradas.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Nenhum lançamento encontrado para estes filtros.</div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-900/50 text-gray-400 text-sm">
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4 text-center">Tipo</th>
                        <th className="p-4 text-right">Valor</th>
                        <th className="p-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {movimentacoesFiltradas.map((mov) => (
                        <tr key={mov.id} className="hover:bg-gray-700/50 transition group">
                          <td className="p-4 text-gray-200 font-medium">{mov.descricao}</td>
                          <td className="p-4 text-gray-400">
                            <span className="px-3 py-1 bg-gray-900 rounded-full text-xs border border-gray-600">
                              {mov.categoria.nome}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-xs px-2 py-1 rounded-md font-medium ${mov.tipo === 'receita' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {mov.tipo.toUpperCase()}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-bold ${mov.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {mov.tipo === 'receita' ? '+' : '-'} {formatarMoeda(Number(mov.valor))}
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleExcluirLancamento(mov.id)}
                              className="text-gray-500 hover:text-red-500 transition opacity-50 group-hover:opacity-100"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Lancamentos;