const express = require('express');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const {
  listar,
  buscarPorId,
  listarPorVeiculo,
  criar,
  atualizar,
  adicionarPeca
} = require('../controllers/ordensServicoController');

const router = express.Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', listar);
router.get('/:id', buscarPorId);
router.get('/veiculo/:veiculoId', listarPorVeiculo);
router.post('/', criar);
router.put('/:id', atualizar);
router.post('/:id/pecas', adicionarPeca);

module.exports = router;