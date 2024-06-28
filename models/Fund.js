// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js
// const Patient = require('../models/Patient');
// const Account = require('../models/Account');

// const Fund = sequelize.define('Fund', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     phone_number: {
//         type: DataTypes.INTEGER,
//     },
//     amount: {
//         type: DataTypes.DECIMAL(10, 2),
//         defaultValue: 0.00
//     },
//     code: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     accountId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: Account, // This is the model that the foreign key references
//           key: 'id' // This is the field in the referenced model
//         }
//       },
//     patientId: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: Patient, // This is the model that the foreign key references
//           key: 'id' // This is the field in the referenced model
//         }
//       },
//   });

//   Fund.belongsTo(Patient, {
//     foreignKey: 'patientId',
//     onDelete: 'CASCADE'
//   });

//   Fund.belongsTo(Account, {
//     foreignKey: 'accountId',
//     onDelete: 'CASCADE'
//   });
  
//   module.exports = Fund;