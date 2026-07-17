const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del cliente es obligatorio' },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El teléfono es obligatorio' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: { msg: 'El email no tiene un formato válido' },
    },
  },
}, {
  tableName: 'clients',
  timestamps: true, // agrega createdAt y updatedAt automáticamente
});

module.exports = Cliente;