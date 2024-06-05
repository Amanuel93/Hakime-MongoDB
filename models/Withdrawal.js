const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./User');

const Withdrawal = sequelize.define('Withdrawal', {
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false
    }
});

Doctor.hasMany(Withdrawal, { foreignKey: 'doctorId' });
module.exports = Withdrawal;
