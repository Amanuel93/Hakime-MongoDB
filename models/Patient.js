const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');

const Patient = sequelize.define('Patient', {
    image: {
      type: DataTypes.BLOB, // This will be mapped to a binary type in the database
      allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
    },
    relevant_allergy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    medical_history: {
      type: DataTypes.STRING,
      allowNull: true
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
  
  module.exports = Patient;