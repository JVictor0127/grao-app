const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- Nova importação do JWT

// --- FUNÇÃO DE CADASTRO (Já existia) ---
const registrar = async (req, res) => {
  try {
    const { nome, apelido, email, senha } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome, // ou nome: "Gustavo", como vier do req.body
        email, 
        senha: senha_hash, // <-- A CORREÇÃO É AQUI! O campo no banco é "senha"
      }
    });

    res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso!', 
      usuario: { id: novoUsuario.id, nome: novoUsuario.nome }
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno no servidor ao tentar cadastrar.' });
  }
};

// --- NOVA FUNÇÃO DE LOGIN ---
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verifica se o usuário existe no banco
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // 2. Compara a senha digitada com o hash criptografado salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // 3. Gera o Token de autenticação (válido por 1 dia)
    const token = jwt.sign(
      { id: usuario.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // 4. Retorna o sucesso junto com o Token
    res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        apelido: usuario.apelido
      }
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno no servidor ao tentar fazer login.' });
  }
};

// Não esqueça de exportar o login também!
module.exports = { registrar, login };