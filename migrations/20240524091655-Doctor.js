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
        type: Sequelize.BLOB,
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
        type: Sequelize.TEXT,
        allowNull: true
      },
      previous_work_experience: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cv: {
        type: Sequelize.BLOB,
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
        type: Sequelize.BLOB,
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
// //     CREATE TRIGGER set_completed_trigger BEFORE INSERT ON Doctors FOR EACH ROW
// //     BEGIN
// //     IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth != '' AND 
// //     NEW.gender IS NOT NULL AND NEW.gender != '' AND 
// //     NEW.nationality IS NOT NULL AND NEW.nationality != '' AND 
// //     NEW.address IS NOT NULL AND NEW.address != '' AND 
// //     NEW.Bio IS NOT NULL AND NEW.Bio != '' AND 
//     NEW.medical_degrees IS NOT NULL AND NEW.medical_degrees != '' AND 
//     NEW.medical_school IS NOT NULL AND NEW.medical_school != '' AND 
//     NEW.year_of_graduation IS NOT NULL AND 
//     NEW.medical_license_number IS NOT NULL AND NEW.medical_license_number != '' AND 
//     NEW.certificate IS NOT NULL AND NEW.certificate != '' AND 
//     NEW.previous_work_experience IS NOT NULL AND NEW.previous_work_experience != '' AND 
//     NEW.cv IS NOT NULL AND NEW.cv != '' AND 
//     NEW.passport_or_national_id_no IS NOT NULL AND NEW.passport_or_national_id_no != '' AND 
//     NEW.language_spoken IS NOT NULL AND NEW.language_spoken != '' AND 
//     NEW.proficiency_level IS NOT NULL AND NEW.proficiency_level != '' AND 
//     NEW.userId IS NOT NULL THEN
//    SET NEW.completed = 'Yes';
//  ELSE
//    SET NEW.completed = 'No';
//  END IF;
//     END;
//   `);
  },

  down: async (queryInterface, Sequelize) => {
    // Dropping the trigger and the table
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS set_doctor_completed_trigger ON "Doctors";');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS set_doctor_completed();');
    await queryInterface.dropTable('Doctors');
  }
};


