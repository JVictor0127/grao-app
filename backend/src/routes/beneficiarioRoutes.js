const express = require('express');
const router = express.Router();
const beneficiarioController = require('../controllers/beneficiarioController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.get('/', beneficiarioController.listarBeneficiarios);
router.post('/', beneficiarioController.criarBeneficiario);
router.delete('/:id', beneficiarioController.deletarBeneficiario);

module.exports = router;