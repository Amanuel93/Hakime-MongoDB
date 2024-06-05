const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js

const First_Aid = sequelize.define('First_Aid', {
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true // Depending on your requirement, it can be allowNull: false if image is mandatory
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

module.exports = First_Aid;
