const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.criarCategoria); // <-- Nova rota
router.delete('/:id', categoriaController.deletarCategoria); // <-- Nova rota

module.exports = router;