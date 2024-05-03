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
        type: Sequelize.BLOB,
        allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
      },
      Bio: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // Professional_Information
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

      // Specialization_Information
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

      // Identification_Documents and Language_Proficiency
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

      // State of the table
      status: {
        type: Sequelize.STRING,
        defaultValue:'not approved',
      },
      step: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      completed: {
        type: Sequelize.STRING,
        defaultValue:'No',
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

    // Adding hook for setting completed field
    await queryInterface.sequelize.query(`
    CREATE TRIGGER set_completed_trigger BEFORE INSERT ON Doctors FOR EACH ROW
    BEGIN
      IF NEW.date_of_birth IS NOT NULL AND NEW.gender IS NOT NULL AND NEW.nationality IS NOT NULL AND 
         NEW.address IS NOT NULL AND NEW.Bio IS NOT NULL AND NEW.medical_degrees IS NOT NULL AND
         NEW.medical_school IS NOT NULL AND NEW.year_of_graduation IS NOT NULL AND NEW.medical_license_number IS NOT NULL AND 
         NEW.certificate IS NOT NULL AND NEW.previous_work_experience IS NOT NULL AND NEW.cv IS NOT NULL AND 
         NEW.passport_or_national_id_no IS NOT NULL AND NEW.language_spoken IS NOT NULL AND 
         NEW.proficiency_level IS NOT NULL AND NEW.userId IS NOT NULL THEN
        SET NEW.completed = 'Yes';
      END IF;
    END;
  `);
  },

  down: async (queryInterface, Sequelize) => {
    // Dropping the trigger and the table
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS set_doctor_completed_trigger ON "Doctors";');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS set_doctor_completed();');
    await queryInterface.dropTable('Doctors');
  }
};


