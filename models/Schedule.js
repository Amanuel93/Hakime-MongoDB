const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
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
  day: {
    type: DataTypes.STRING,
    allowNull: true
  },
  initial_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  final_time: {
    type: DataTypes.TIME,
    allowNull: true
  }
});

Schedule.belongsTo(Doctor)
Doctor.hasMany(Schedule, {foreignKey:'doctorId'})

module.exports = Schedule;