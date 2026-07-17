'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      motoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'moto_id',
        references: {
          model: 'bikes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      entryDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'entry_date',
        defaultValue: Sequelize.NOW,
      },
      faultDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'fault_description',
      },
      status: {
        type: Sequelize.ENUM(
          'RECIBIDA',
          'DIAGNOSTICO',
          'EN_PROCESO',
          'LISTA',
          'ENTREGADA',
          'CANCELADA'
        ),
        allowNull: false,
        defaultValue: 'RECIBIDA',
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('work_orders');
    // También eliminamos el tipo ENUM que MySQL/Postgres pudo haber creado
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_work_orders_status";').catch(() => {});
  },
};