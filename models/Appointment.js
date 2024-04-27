const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');


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
//    scheduleId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: Schedule, // This is the model that the foreign key references
//           key: 'id' // This is the field in the referenced model
//         }
//       },
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
        allowNull: false
      },
    date:{
        type:DataTypes.DATE,
        allowNull:false
      },
    time: {
        type: DataTypes.TIME,
        allowNull: false
      },
});

Appointment.belongsTo(User, { foreignKey: 'doctorId' });



module.exports = Appointment;