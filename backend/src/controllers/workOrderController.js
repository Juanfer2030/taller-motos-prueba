const { WorkOrder, Moto, Cliente, Item, WorkOrderStatusHistory } = require('../models');
const { esTransicionValida } = require('../utils/workOrderStateMachine');
const sequelize = require('../config/database');

// POST /api/work-orders
async function createWorkOrder(req, res, next) {
  try {
    const { motoId, faultDescription } = req.body;

    const moto = await Moto.findByPk(motoId);
    if (!moto) {
      return res.status(400).json({ message: 'No se puede crear una orden sin una moto válida' });
    }

    const workOrder = await WorkOrder.create({
      motoId,
      faultDescription,
      status: 'RECIBIDA',
      total: 0,
    });

    res.status(201).json(workOrder);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/work-orders/:id/status
async function updateWorkOrderStatus(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status: nuevoEstado } = req.body;

    const workOrder = await WorkOrder.findByPk(id, { transaction });
    if (!workOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const estadoActual = workOrder.status;

    if (!esTransicionValida(estadoActual, nuevoEstado)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `No se puede cambiar de "${estadoActual}" a "${nuevoEstado}". Transición inválida.`,
      });
    }

    workOrder.status = nuevoEstado;
    await workOrder.save({ transaction });

    await WorkOrderStatusHistory.create(
      {
        workOrderId: id,
        previousStatus: estadoActual,
        newStatus: nuevoEstado,
        changedBy: req.user?.id || null, // preparado para cuando exista JWT
      },
      { transaction }
    );

    await transaction.commit();

    res.json(workOrder);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

// GET /api/work-orders?status=&plate=&page=&pageSize=
async function getWorkOrders(req, res, next) {
  try {
    const { status, plate, page = 1, pageSize = 10 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const motoWhere = {};
    if (plate) {
      motoWhere.plate = plate;
    }

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { count, rows } = await WorkOrder.findAndCountAll({
      where,
      include: {
        model: Moto,
        as: 'moto',
        where: motoWhere,
        include: { model: Cliente, as: 'cliente' },
      },
      order: [['id', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        pageSize: limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/work-orders/:id
async function getWorkOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const workOrder = await WorkOrder.findByPk(id, {
      include: [
        {
          model: Moto,
          as: 'moto',
          include: { model: Cliente, as: 'cliente' },
        },
        {
          model: Item,
          as: 'items',
        },
      ],
    });

    if (!workOrder) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(workOrder);
  } catch (error) {
    next(error);
  }
}

// GET /api/work-orders/:id/history
async function getWorkOrderHistory(req, res, next) {
  try {
    const { id } = req.params;

    const workOrder = await WorkOrder.findByPk(id);
    if (!workOrder) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const history = await WorkOrderStatusHistory.findAll({
      where: { workOrderId: id },
      order: [['createdAt', 'ASC']],
    });

    res.json(history);
  } catch (error) {
    next(error);
  }
}

module.exports = { createWorkOrder, updateWorkOrderStatus, getWorkOrders, getWorkOrderById,getWorkOrderHistory, };