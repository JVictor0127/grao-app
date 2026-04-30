const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // 1. Pega o token enviado no cabeçalho da requisição
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  // O padrão do token é vir escrito "Bearer NNNNNN", então separamos a palavra do código
  const partes = tokenHeader.split(' ');
  if (partes.length !== 2) {
    return res.status(401).json({ erro: 'Erro no formato do token.' });
  }

  const [esquema, token] = partes;

  if (!/^Bearer$/i.test(esquema)) {
    return res.status(401).json({ erro: 'Token mal formatado.' });
  }

  // 2. Verifica se o token é válido com a nossa senha secreta
  jwt.verify(token, process.env.JWT_SECRET, (erro, decodificado) => {
    if (erro) {
      return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }

    // 3. Se deu tudo certo, guarda o ID do usuário na requisição e deixa passar (next)
    req.usuarioId = decodificado.id;
    return next();
  });
};

module.exports = verificarToken;