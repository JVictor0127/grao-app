import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ArrowRightLeft, Tags, Settings, LogOut, 
  TrendingUp, TrendingDown, Wallet, Plus, X, Trash2 
} from 'lucide-react';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  
  // --- NOVO ESTADO: Guardar as categorias reais ---
  const [categorias, setCategorias] = useState([]); 
  
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  // O id_categoria agora começa vazio, forçando o usuário a escolher
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    id_categoria: '' 
  });

  useEffect(() => {
    const token = localStorage.getItem('grao_token');
    const userStorage = localStorage.getItem('grao_usuario');
    if (!token || !userStorage) {
      navigate('/login');
    } else {
      setUsuario(JSON.parse(userStorage));
      buscarDados();
      buscarCategorias(); // <-- Chama a busca de categorias ao abrir a tela
    }
  }, [navigate]);

  const buscarDados = async () => {
    try {
      const response = await api.get('/movimentacoes');
      setMovimentacoes(response.data);
      calcularResumo(response.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    } finally {
      setCarregandoDados(false);
    }
  };

  // --- NOVA FUNÇÃO: Buscar Categorias ---
  const buscarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const calcularResumo = (dados) => {
    let totalReceitas = 0;
    let totalDespesas = 0;
    dados.forEach(item => {
      if (item.tipo === 'receita') totalReceitas += Number(item.valor);
      else if (item.tipo === 'despesa') totalDespesas += Number(item.valor);
    });
    setResumo({ receitas: totalReceitas, despesas: totalDespesas, saldo: totalReceitas - totalDespesas });
  };

  const handleLogout = () => {
    localStorage.removeItem('grao_token');
    localStorage.removeItem('grao_usuario');
    navigate('/login');
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const handleSalvarLancamento = async (e) => {
    e.preventDefault();
    
    // Trava de segurança: impede salvar sem categoria
    if (!form.id_categoria) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    setSalvando(true);

    try {
      await api.post('/movimentacoes', {
        descricao: form.descricao,
        valor: Number(form.valor.replace(',', '.')),
        tipo: form.tipo,
        id_categoria: Number(form.id_categoria),
        formaPagamento: 'Pix'
      });

      setModalAberto(false);
      setForm({ descricao: '', valor: '', tipo: 'despesa', id_categoria: '' });
      buscarDados(); 
      
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o lançamento.');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirLancamento = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        await api.delete(`/movimentacoes/${id}`);
        buscarDados();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir o lançamento.');
      }
    }
  };

  if (!usuario) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col hidden md:flex">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-blue-500">Grão</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Visão Geral
          </button>
          <button 
            onClick={() => navigate('/lancamentos')} 
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Lançamentos
          </button>
          <button 
            onClick={() => navigate('/categorias')} 
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition">
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
          <h2 className="text-2xl font-semibold">Visão Geral</h2>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setModalAberto(true)}
              className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg items-center gap-2 font-medium transition"
            >
              <Plus className="w-5 h-5" /> Novo Lançamento
            </button>
            <div className="flex items-center gap-3 border-l border-gray-700 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Bem-vindo(a),</p>
                <p className="font-medium">{usuario.nome}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {carregandoDados ? (
            <div className="flex justify-center items-center h-full text-gray-400">Carregando...</div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex justify-between mb-4"><h3 className="text-gray-400">Receitas</h3><TrendingUp className="text-emerald-500" /></div>
                  <p className="text-3xl font-bold text-emerald-400">{formatarMoeda(resumo.receitas)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex justify-between mb-4"><h3 className="text-gray-400">Despesas</h3><TrendingDown className="text-red-500" /></div>
                  <p className="text-3xl font-bold text-red-400">{formatarMoeda(resumo.despesas)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex justify-between mb-4"><h3 className="text-gray-400">Saldo Atual</h3><Wallet className="text-blue-500" /></div>
                  <p className="text-3xl font-bold text-white">{formatarMoeda(resumo.saldo)}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold">Últimos Lançamentos</h3></div>
                <div className="p-0 overflow-x-auto">
                  {movimentacoes.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhuma movimentação registrada.</div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-gray-900/50 text-gray-400 text-sm">
                          <th className="p-4">Descrição</th>
                          <th className="p-4">Categoria</th>
                          <th className="p-4 text-right">Valor</th>
                          <th className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {movimentacoes.map((mov) => (
                          <tr key={mov.id} className="hover:bg-gray-700/50 transition group">
                            <td className="p-4 text-gray-200">{mov.descricao}</td>
                            <td className="p-4 text-gray-400"><span className="px-3 py-1 bg-gray-900 rounded-full text-xs border border-gray-600">{mov.categoria.nome}</span></td>
                            <td className={`p-4 text-right font-medium ${mov.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {mov.tipo === 'receita' ? '+' : '-'} {formatarMoeda(Number(mov.valor))}
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleExcluirLancamento(mov.id)}
                                className="text-gray-500 hover:text-red-500 transition opacity-50 group-hover:opacity-100"
                                title="Excluir Lançamento"
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
          )}
        </div>
      </main>

      {/* --- O MODAL DE NOVO LANÇAMENTO --- */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Novo Lançamento</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSalvarLancamento} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="tipo" value="despesa" checked={form.tipo === 'despesa'} onChange={(e) => setForm({...form, tipo: e.target.value})} className="peer sr-only" />
                  <div className="p-3 text-center rounded-lg border border-gray-600 text-gray-300 peer-checked:bg-red-500/20 peer-checked:border-red-500 peer-checked:text-red-400 transition font-medium">Despesa</div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="tipo" value="receita" checked={form.tipo === 'receita'} onChange={(e) => setForm({...form, tipo: e.target.value})} className="peer sr-only" />
                  <div className="p-3 text-center rounded-lg border border-gray-600 text-gray-300 peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500 peer-checked:text-emerald-400 transition font-medium">Receita</div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <input 
                  type="text" required
                  value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: Conta de Luz"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Valor (R$)</label>
                  <input 
                    type="number" step="0.01" required
                    value={form.valor} onChange={(e) => setForm({...form, valor: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="0,00"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                  <select 
                    value={form.id_categoria} 
                    onChange={(e) => setForm({...form, id_categoria: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    {/* Renderização dinâmica das categorias reais! */}
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" disabled={salvando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition mt-4"
              >
                {salvando ? 'Salvando...' : 'Salvar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;