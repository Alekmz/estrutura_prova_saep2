const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const movementRoutes = require('./routes/movement.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api', (_req, res) => {
  res.json({
    message: 'API de almoxarifado online.',
    health: '/api/health',
    login: {
      method: 'POST',
      path: '/api/auth/login'
    },
    observacao: 'As rotas de produtos, usuarios e movimentacoes precisam de token JWT.'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/movimentacoes', movementRoutes);

app.use(errorHandler);

module.exports = app;

