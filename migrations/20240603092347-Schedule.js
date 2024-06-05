'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Doctors', // This should match the table name in your database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
      day: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hour: {
        type: Sequelize.STRING,
        allowNull: true
      },
      minute: {
        type: Sequelize.STRING,
        allowNull: true
      },
      period: {
        type: Sequelize.ENUM('AM','PM'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedules');
  }
};

