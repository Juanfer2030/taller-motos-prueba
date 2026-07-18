const express = require('express');
const router = express.Router();
const {
  createCliente,
  getClientes,
  getClienteById,
} = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createCliente);
router.get('/', authMiddleware, getClientes);
router.get('/:id', authMiddleware, getClienteById);

module.exports = router;