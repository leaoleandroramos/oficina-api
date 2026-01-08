require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/database');

const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const veiculosRoutes = require('./routes/veiculos');
const pecasRoutes = require('./routes/pecas');
const ordensServicoRoutes = require('./routes/ordensServico');
const clientePortalRoutes = require('./routes/clientePortal');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para injetar Prisma em req
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/veiculos', veiculosRoutes);
app.use('/api/pecas', pecasRoutes);
app.use('/api/ordens-servico', ordensServicoRoutes);
app.use('/api/cliente-portal', clientePortalRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});