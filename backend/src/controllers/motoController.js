const { Moto, Cliente } = require('../models');

// POST /api/bikes
async function createMoto(req, res, next) {
  try {
    const { plate, brand, model, cylinder, clientId } = req.body;

    const cliente = await Cliente.findByPk(clientId);
    if (!cliente) {
      return res.status(400).json({ message: 'El cliente indicado no existe' });
    }

    const moto = await Moto.create({ plate, brand, model, cylinder, clientId });

    res.status(201).json(moto);
  } catch (error) {
    next(error);
  }
}

// GET /api/bikes?plate=
async function getMotos(req, res, next) {
  try {
    const { plate } = req.query;

    const where = plate ? { plate } : {};

    const motos = await Moto.findAll({
      where,
      include: { model: Cliente, as: 'cliente' },
      order: [['id', 'DESC']],
    });

    res.json(motos);
  } catch (error) {
    next(error);
  }
}

// GET /api/bikes/:id
async function getMotoById(req, res, next) {
  try {
    const { id } = req.params;

    const moto = await Moto.findByPk(id, {
      include: { model: Cliente, as: 'cliente' },
    });

    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    res.json(moto);
  } catch (error) {
    next(error);
  }
}

module.exports = { createMoto, getMotos, getMotoById };