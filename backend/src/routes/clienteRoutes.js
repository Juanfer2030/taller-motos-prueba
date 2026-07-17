const express = require('express');
const router = express.Router();
const {
  createCliente,
  getClientes,
  getClienteById,
} = require('../controllers/clienteController');

router.post('/', createCliente);
router.get('/', getClientes);
router.get('/:id', getClienteById);

module.exports = router;