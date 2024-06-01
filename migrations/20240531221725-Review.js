'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
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
          model: 'Doctors', // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    patientId: {
        type:  Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Patients', // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    userId: {
        type:  Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    review_text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    rating: {
      type:  Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type:  Sequelize.STRING,
      allowNull: false
    },
    image: {
      type:  Sequelize.STRING,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};

