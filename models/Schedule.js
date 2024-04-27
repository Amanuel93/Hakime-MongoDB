const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const Schedule = sequelize.define('Schedule', {
  doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Doctor, // This is the model that the foreign key references
          key: 'id' // This is the field in the referenced model
        }
      },
  monday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tuesday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  wednesday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thursday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  friday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  saturday: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sunday: {
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

Schedule.belongsTo(Doctor)
Doctor.hasMany(Schedule,{foreignKey:'doctorId'})

module.exports = Schedule;