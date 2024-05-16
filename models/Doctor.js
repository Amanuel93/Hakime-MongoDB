const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');

const Doctor = sequelize.define('Doctor', {

  // Personal_Information
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
  },
  Bio: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Professional_Information
  medical_degrees: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medical_school: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year_of_graduation: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING 
  },

  // Specialization_Information
  medical_license_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  certificate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  previous_work_experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cv: {
    type: DataTypes.BLOB,
    allowNull: true
  },

  // Identification_Documents and Language_Proficiency
  passport_or_national_id_no: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language_spoken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proficiency_level: {
    type: DataTypes.ENUM('Basic', 'Intermediate', 'Advanced', 'Fluent'),
    allowNull: true
  },

  // State of the table
  status: {
    type: DataTypes.STRING,
    defaultValue:'not approved',
  },
  step: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  completed: {
    type: DataTypes.STRING,
    defaultValue:'No',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // This is the model that the foreign key references
      key: 'id' // This is the field in the referenced model
    }
  }
});

User.hasOne(Doctor, { foreignKey: 'userId'});
Doctor.belongsTo(User,{ foreignKey: 'userId'});

module.exports = Doctor;
