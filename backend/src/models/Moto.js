const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Moto = sequelize.define('Moto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Ya existe una moto registrada con esa placa',
    },
    validate: {
      notEmpty: { msg: 'La placa es obligatoria' },
    },
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La marca es obligatoria' },
    },
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El modelo es obligatorio' },
    },
  },
  cylinder: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id',
    },
  },
}, {
  tableName: 'bikes',
  timestamps: true,
});

module.exports = Moto;