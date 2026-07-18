const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Ya existe un usuario registrado con ese email',
    },
    validate: {
      isEmail: { msg: 'El email no tiene un formato válido' },
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash',
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MECANICO'),
    allowNull: false,
    defaultValue: 'MECANICO',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;