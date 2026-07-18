const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkOrderStatusHistory = sequelize.define('WorkOrderStatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  workOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'work_order_id',
    references: {
      model: 'work_orders',
      key: 'id',
    },
  },
  previousStatus: {
    type: DataTypes.STRING,
    allowNull: true, // el primer estado (RECIBIDA al crear la orden) no tiene "estado anterior"
    field: 'previous_status',
  },
  newStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'new_status',
  },
  changedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, // lo dejamos nullable por ahora, hasta que exista JWT
    field: 'changed_by',
  },
}, {
  tableName: 'work_order_status_history',
  timestamps: true,
  updatedAt: false, // un registro de historial nunca se actualiza, solo se crea una vez
});

module.exports = WorkOrderStatusHistory;