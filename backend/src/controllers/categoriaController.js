const prisma = require('../config/prisma');

const listarCategorias = async (req, res) => {
  try {
    const usuario_id = req.usuarioId;
    const categorias = await prisma.categoria.findMany({
      where: { usuario_id: usuario_id },
      orderBy: { nome: 'asc' }
    });
    res.status(200).json(categorias);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar as categorias.' });
  }
};

const criarCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    const usuario_id = req.usuarioId;

    if (!nome) {
      return res.status(400).json({ erro: 'O nome da categoria é obrigatório.' });
    }

    const novaCategoria = await prisma.categoria.create({
      data: {
        nome,
        usuario_id
      }
    });

    res.status(201).json(novaCategoria);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar a categoria.' });
  }
};

const deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuarioId;

    const categoria = await prisma.categoria.findFirst({
      where: { 
        id: Number(id),
        usuario_id: usuario_id 
      }
    });

    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada ou acesso negado.' });
    }

    await prisma.categoria.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ mensagem: 'Categoria excluída com sucesso!' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao excluir. Verifique se existem lançamentos usando esta categoria.' });
  }
};

// Aqui é onde o erro acontece se faltar alguma função!
module.exports = { listarCategorias, criarCategoria, deletarCategoria };