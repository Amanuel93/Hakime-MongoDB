// models/post.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js

// const Doctor = require('../models/Doctor');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const User = require('./User');

const Review = sequelize.define('Review', {
   doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Doctor, // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Patient, // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User, // This is the model that the foreign key references
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
    },
    name: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    image: {
      type:  DataTypes.STRING,
      allowNull: true
    },
  });

 // Define associations
Doctor.hasMany(Review, { foreignKey: 'doctorId' });
Review.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(Review, { foreignKey: 'patientId' });
Review.belongsTo(Patient, { foreignKey: 'patientId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = Review;
