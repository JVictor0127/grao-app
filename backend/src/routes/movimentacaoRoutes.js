const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Rotas protegidas
router.post('/', movimentacaoController.criarMovimentacao);
router.get('/', movimentacaoController.listarMovimentacoes);
router.delete('/:id', movimentacaoController.deletarMovimentacao); // <-- ROTA DE DELETAR CRIADA!

module.exports = router;