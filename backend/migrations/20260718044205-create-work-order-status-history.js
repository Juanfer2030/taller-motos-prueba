'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('work_order_status_history', {
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
      previousStatus: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'previous_status',
      },
      newStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'new_status',
      },
      changedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'changed_by',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('work_order_status_history');
  },
};