const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota POST para o cadastro
router.post('/cadastro', authController.registrar);

// Nova Rota POST para o login
router.post('/login', authController.login);

module.exports = router;