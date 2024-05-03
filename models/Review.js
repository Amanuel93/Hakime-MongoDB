// models/post.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const Review = sequelize.define('Review', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Patient, // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
  doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Doctor, // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Doctor.hasMany(Review, { foreignKey: 'doctorId' });
  Review.belongsTo(Doctor);
 
  Patient.hasMany(Review, { foreignKey: 'patientId' });
  Review.belongsTo(Patient);

  module.exports = Review;
