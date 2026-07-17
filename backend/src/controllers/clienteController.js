const { Cliente, Moto } = require('../models');
const { Op } = require('sequelize');

// POST /api/clients
async function createCliente(req, res, next) {
  try {
    const { name, phone, email } = req.body;

    const cliente = await Cliente.create({ name, phone, email });

    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
}

// GET /api/clients?search=
async function getClientes(req, res, next) {
  try {
    const { search } = req.query;

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const clientes = await Cliente.findAll({ where, order: [['id', 'DESC']] });

    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

// GET /api/clients/:id
async function getClienteById(req, res, next) {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, {
      include: { model: Moto, as: 'motos' },
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

module.exports = { createCliente, getClientes, getClienteById };