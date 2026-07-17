const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ESTADOS = ['RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'];

const WorkOrder = sequelize.define('WorkOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  motoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'moto_id',
    references: {
      model: 'bikes',
      key: 'id',
    },
  },
  entryDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'entry_date',
  },
  faultDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'fault_description',
    validate: {
      notEmpty: { msg: 'La descripción de la falla es obligatoria' },
    },
  },
  status: {
    type: DataTypes.ENUM(...ESTADOS),
    allowNull: false,
    defaultValue: 'RECIBIDA',
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'work_orders',
  timestamps: true,
});

WorkOrder.ESTADOS = ESTADOS;

module.exports = WorkOrder;