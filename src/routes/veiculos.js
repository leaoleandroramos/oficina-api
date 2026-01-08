const express = require('express');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const { listar, listarPorCliente, criar, atualizar, deletar } = require('../controllers/veiculosController');

const router = express.Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', listar);
router.get('/cliente/:clienteId', listarPorCliente);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;