const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
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
  type: {
    type: DataTypes.ENUM('MANO_OBRA', 'REPUESTO'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción del ítem es obligatoria' },
    },
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser mayor a 0' },
    },
  },
  unitValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_value',
    validate: {
      min: { args: [0], msg: 'El valor unitario no puede ser negativo' },
    },
  },
}, {
  tableName: 'items',
  timestamps: true,
});

module.exports = Item;