const prisma = require('../config/prisma');

const listarBeneficiarios = async (req, res) => {
  try {
    const usuario_id = req.usuarioId;
    const beneficiarios = await prisma.beneficiario.findMany({
      where: { usuario_id },
      orderBy: { nome: 'asc' }
    });
    res.status(200).json(beneficiarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar os beneficiários.' });
  }
};

const criarBeneficiario = async (req, res) => {
  try {
    const { nome } = req.body;
    const usuario_id = req.usuarioId;

    if (!nome) return res.status(400).json({ erro: 'O nome é obrigatório.' });

    const novoBeneficiario = await prisma.beneficiario.create({
      data: { nome, usuario_id }
    });
    res.status(201).json(novoBeneficiario);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar o beneficiário.' });
  }
};

const deletarBeneficiario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuarioId;

    const beneficiario = await prisma.beneficiario.findFirst({
      where: { id: Number(id), usuario_id }
    });

    if (!beneficiario) return res.status(404).json({ erro: 'Beneficiário não encontrado.' });

    await prisma.beneficiario.delete({ where: { id: Number(id) } });
    res.status(200).json({ mensagem: 'Excluído com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir. Pode estar em uso.' });
  }
};

module.exports = { listarBeneficiarios, criarBeneficiario, deletarBeneficiario };