'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workOrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'work_order_id',
        references: {
          model: 'work_orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('MANO_OBRA', 'REPUESTO'),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unitValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'unit_value',
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
    await queryInterface.dropTable('items');
  },
};