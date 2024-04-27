const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');

const Doctor = sequelize.define('Doctor', {
  
  //Personal_Information
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
  },
  Bio: {
    type: DataTypes.STRING,
    allowNull: false
  },

  //Professional_Information
  medical_degrees: {
    type: DataTypes.STRING,
    allowNull: false
  },
  medical_school: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year_of_graduation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING 
  },

  //Specialization_Information
  medical_license_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  certificate: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  previous_work_experience: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cv: {
    type: DataTypes.BLOB,
    allowNull: false
  },

  //Identification_Documents and Language_Proficiency
  passport_or_national_id_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language_spoken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proficiency_level: {
    type: DataTypes.ENUM('Basic', 'Intermediate', 'Advanced', 'Fluent'),
    allowNull: false
  },

  //state of the table
  status: {
    type: DataTypes.STRING,
    defaultValue:'not approved',
  },
  completed: {
    type: DataTypes.STRING,
    defaultValue:'No',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // This is the model that the foreign key references
      key: 'id' // This is the field in the referenced model
    }
  }
});

module.exports = Doctor;