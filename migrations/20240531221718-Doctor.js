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
      // Personal_Information
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: true
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true // Depending on your requirement, it can be allowNull: true if image is mandatory
      },
      Bio: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // Professional_Information
      medical_degrees: {
        type: Sequelize.STRING,
        allowNull: true
      },
      medical_school: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year_of_graduation: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      specialization: {
        type: Sequelize.STRING 
      },

      // Specialization_Information
      medical_license_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hourly_rate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certificate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previous_work_experience: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cv: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // Identification_Documents and Language_Proficiency
      passport_or_national_id_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      language_spoken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      proficiency_level: {
        type: Sequelize.ENUM('Basic', 'Intermediate', 'Advanced', 'Fluent'),
        allowNull: true
      },
      Id_Image: {
        type: Sequelize.STRING,
        allowNull: true // Depending on your requirement, it can be allowNull: true if image is mandatory
      },

      // State of the table
      status: {
        type: Sequelize.STRING,
        defaultValue:'not approved',
      },
      step: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rating_score: {
        type: Sequelize.INTEGER,
        defaultValue:0,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
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
    // Dropping the trigger and the table
    await queryInterface.dropTable('Doctors');
  }
};