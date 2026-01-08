const express = require('express');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const { meusVeiculos, ordensDoVeiculo } = require('../controllers/clientePortalController');

const router = express.Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/veiculos', meusVeiculos);
router.get('/ordens/:veiculoId', ordensDoVeiculo);

module.exports = router;