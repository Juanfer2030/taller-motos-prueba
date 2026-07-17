const { Item, WorkOrder } = require('../models');
const sequelize = require('../config/database');

// Función auxiliar: recalcula el total sumando todos los ítems de una orden
async function recalcularTotal(workOrderId, transaction) {
  const items = await Item.findAll({
    where: { workOrderId },
    transaction,
  });

  const total = items.reduce((suma, item) => {
    return suma + item.count * parseFloat(item.unitValue);
  }, 0);

  await WorkOrder.update(
    { total },
    { where: { id: workOrderId }, transaction }
  );
}

// POST /api/work-orders/:id/items
async function addItem(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // id de la work order
    const { type, description, count, unitValue } = req.body;

    const workOrder = await WorkOrder.findByPk(id, { transaction });
    if (!workOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const item = await Item.create(
      { workOrderId: id, type, description, count, unitValue },
      { transaction }
    );

    await recalcularTotal(id, transaction);

    await transaction.commit();

    res.status(201).json(item);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

// DELETE /api/work-orders/items/:itemId
async function deleteItem(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { itemId } = req.params;

    const item = await Item.findByPk(itemId, { transaction });
    if (!item) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ítem no encontrado' });
    }

    const workOrderId = item.workOrderId;

    await item.destroy({ transaction });

    await recalcularTotal(workOrderId, transaction);

    await transaction.commit();

    res.json({ message: 'Ítem eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

module.exports = { addItem, deleteItem };
