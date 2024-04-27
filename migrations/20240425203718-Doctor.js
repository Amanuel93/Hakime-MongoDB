'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.BLOB, // This will be mapped to a binary type in the database
        allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
      },
      Bio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medical_degrees: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medical_school: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year_of_graduation: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      specialization: {
        type: Sequelize.STRING
      },
      medical_license_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      certificate: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      previous_work_experience: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cv: {
        type: Sequelize.BLOB,
        allowNull: false
      },
      passport_or_national_id_no: {
        type: Sequelize.STRING,
        allowNull: false
      },
      language_spoken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      proficiency_level: {
        type: Sequelize.ENUM('Basic', 'Intermediate', 'Advanced', 'Fluent'),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'not approved'
      },
      completed: {
        type: Sequelize.STRING,
        defaultValue: 'No'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Assuming the User model is named 'Users'
          key: 'id'
        }
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
    await queryInterface.dropTable('Doctors');
  }
};
