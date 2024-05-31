const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const Appointment = sequelize.define('Appointment', {
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
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
      type: DataTypes.STRING,
      allowNull: false,
      },
   day: {
        type:DataTypes.STRING,
        allowNull: true
      },
  time: {
        type: DataTypes.STRING,
        allowNull: true
      },
  status:{
      type:DataTypes.STRING,
      defaultValue:'pending',
      },
  duration: {
      type: DataTypes.STRING,
      allowNull: false
      },
  hourly_rate: {
      type: DataTypes.TIME,
       allowNull: false
      },
  response: {
        type: DataTypes.STRING,
        allowNull: true
      },
});

Appointment.belongsTo(Doctor);
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });

Appointment.belongsTo(Patient);
Patient.hasMany(Appointment, { foreignKey: 'patientId' });



module.exports = Appointment;