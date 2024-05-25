'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Correctly reference the Users table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Correctly reference the Users table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      case: {
        type: Sequelize.STRING,
        allowNull: false
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
      status: {
        type: Sequelize.STRING,
        defaultValue:'pending',
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hourly_rate: {
        type: Sequelize.TIME,
        allowNull: false
      },
      response: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Appointments');
  }
};

