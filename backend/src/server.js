const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes'); 
const categoriaRoutes = require('./routes/categoriaRoutes');
const beneficiarioRoutes = require('./routes/beneficiarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/movimentacoes', movimentacaoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/beneficiarios', beneficiarioRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor do Grão v1.0 está rodando perfeitamente!' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});