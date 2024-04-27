const dotenv = require('dotenv');
dotenv.config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Async function to authenticate Sequelize
async function authenticateSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
sequelize.options.logging = console.log;

// Call the async function to authenticate Sequelize
authenticateSequelize();

module.exports = sequelize;

