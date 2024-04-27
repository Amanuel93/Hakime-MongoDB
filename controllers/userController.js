const User = require('../models/User');
const Post = require('../models/post');
const Schedule = require('../models/User');
const Appointment = require('../models/post');

module.exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({include:[Post]});
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Controller function to get a single user by ID
  module.exports.getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id,{include:[Post]});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  