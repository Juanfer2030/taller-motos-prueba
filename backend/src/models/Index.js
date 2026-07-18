const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Moto = require('./Moto');
const WorkOrder = require('./WorkOrder');
const Item = require('./Item');
const WorkOrderStatusHistory = require('./WorkOrderStatusHistory');
const User = require('./User');

// Cliente (1) --< (N) Moto
Cliente.hasMany(Moto, { foreignKey: 'clientId', as: 'motos' });
Moto.belongsTo(Cliente, { foreignKey: 'clientId', as: 'cliente' });

// Moto (1) --< (N) WorkOrder
Moto.hasMany(WorkOrder, { foreignKey: 'motoId', as: 'workOrders' });
WorkOrder.belongsTo(Moto, { foreignKey: 'motoId', as: 'moto' });

// WorkOrder (1) --< (N) Item
WorkOrder.hasMany(Item, { foreignKey: 'workOrderId', as: 'items' });
Item.belongsTo(WorkOrder, { foreignKey: 'workOrderId', as: 'workOrder' });

// WorkOrder (1) --< (N) WorkOrderStatusHistory
WorkOrder.hasMany(WorkOrderStatusHistory, { foreignKey: 'workOrderId', as: 'statusHistory' });
WorkOrderStatusHistory.belongsTo(WorkOrder, { foreignKey: 'workOrderId', as: 'workOrder' });

module.exports = {
  sequelize,
  Cliente,
  Moto,
  WorkOrder,
  Item,
  WorkOrderStatusHistory,
  User,
};