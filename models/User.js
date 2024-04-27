const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming your Sequelize instance is configured in db.js


const User = sequelize.define('User', {
  name: DataTypes.STRING,
  phone_number:{
    type:DataTypes.STRING,
    allowNull:false
  },
  email:{
    type:DataTypes.STRING,
    unique:true,
    allowNull:false
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  role:{
    type:DataTypes.STRING,
    allowNull:false
  } , 
});



module.exports = User;
