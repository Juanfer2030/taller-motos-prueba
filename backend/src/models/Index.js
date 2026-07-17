const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Moto = require('./Moto');
const WorkOrder = require('./WorkOrder');
const Item = require('./Item');

// Cliente (1) -> Moto
Cliente.hasMany(Moto, { foreignKey: 'clientId', as: 'motos' });
Moto.belongsTo(Cliente, { foreignKey: 'clientId', as: 'cliente' });

// Moto (1) -> WorkOrder
Moto.hasMany(WorkOrder, { foreignKey: 'motoId', as: 'workOrders' });
WorkOrder.belongsTo(Moto, { foreignKey: 'motoId', as: 'moto' });

// WorkOrder (1) -> Item
WorkOrder.hasMany(Item, { foreignKey: 'workOrderId', as: 'items' });
Item.belongsTo(WorkOrder, { foreignKey: 'workOrderId', as: 'workOrder' });

module.exports = {
  sequelize,
  Cliente,
  Moto,
  WorkOrder,
  Item,
};