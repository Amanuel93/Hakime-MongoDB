const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const Schedule = sequelize.define('Schedule', {
  doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Doctor, // This is the model that the foreign key references
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
  day: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hour: {
    type: DataTypes.STRING,
    allowNull: true
  },
  minute: {
    type: DataTypes.STRING,
    allowNull: true
  },
  period: {
    type: DataTypes.ENUM('AM','PM'),
    allowNull: true
  },
});

Schedule.belongsTo(Doctor)
Doctor.hasMany(Schedule, {foreignKey:'doctorId'})

Schedule.belongsTo(User)
User.hasMany(Schedule, {foreignKey:'userId'})

module.exports = Schedule;