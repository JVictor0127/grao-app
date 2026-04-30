const prisma = require('../config/prisma');

// --- FUNÇÃO PARA SALVAR NOVA RECEITA/DESPESA ---
const criarMovimentacao = async (req, res) => {
  try {
    const { id_categoria, id_beneficiario, descricao, formaPagamento, valor, tipo, dataVencimento, dataTitulo } = req.body;
    
    // O ID do usuário vem direto do nosso "Segurança" (Middleware)
    const usuario_id = req.usuarioId; 

    const novaMovimentacao = await prisma.regMovimentacao.create({
      data: {
        usuario_id,
        id_categoria,
        id_beneficiario, // É opcional, pode vir vazio
        descricao,
        formaPagamento,
        valor,
        tipo, // "receita" ou "despesa"
        dataVencimento: dataVencimento ? new Date(dataVencimento) : null,
        dataTitulo: dataTitulo ? new Date(dataTitulo) : null
      }
    });

    res.status(201).json({ mensagem: 'Lançamento registrado!', movimentacao: novaMovimentacao });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar a movimentação.' });
  }
};

// --- FUNÇÃO PARA LISTAR O FLUXO DE CAIXA ---
const listarMovimentacoes = async (req, res) => {
  try {
    const usuario_id = req.usuarioId;

    const movimentacoes = await prisma.regMovimentacao.findMany({
      where: { usuario_id },
      orderBy: { dataAtual: 'desc' }, // Traz as mais recentes primeiro
      include: {
        categoria: true, // Já faz o JOIN e traz os dados da categoria junto
        beneficiario: true
      }
    });

    res.status(200).json(movimentacoes);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar movimentações.' });
  }
};

// --- FUNÇÃO PARA DELETAR UM LANÇAMENTO ---
const deletarMovimentacao = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    const usuario_id = req.usuarioId; // Pega o dono do Token

    // 1. Verifica se o lançamento existe e se pertence a esse usuário
    const movimentacao = await prisma.regMovimentacao.findFirst({
      where: { 
        id: Number(id),
        usuario_id: usuario_id 
      }
    });

    if (!movimentacao) {
      return res.status(404).json({ erro: 'Lançamento não encontrado ou acesso negado.' });
    }

    // 2. Se tudo estiver certo, deleta do banco
    await prisma.regMovimentacao.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ mensagem: 'Lançamento excluído com sucesso!' });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir a movimentação.' });
  }
};

module.exports = { criarMovimentacao, listarMovimentacoes, deletarMovimentacao };
