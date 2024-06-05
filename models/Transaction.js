const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Account = require('../models/Account');
const Appointment = require('../models/Appointment');

const Transaction = sequelize.define('Transaction', {
    from_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    to_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    transaction_type: {
        type: DataTypes.ENUM('deposit', 'payment', 'withdrawal', 'fee'),
        allowNull: false
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
});

    Transaction.belongsTo(Account, {foreignKey: 'from_account_id' });
    Transaction.belongsTo(Account, {foreignKey: 'to_account_id' });
    Transaction.belongsTo(Appointment, { foreignKey: 'appointment_id' });

module.exports = Transaction;
