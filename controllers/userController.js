const User = require('../models/User');
const Post = require('../models/Post');
const Doctor  = require('../models/Doctor');
const Patient  = require('../models/Patient');
const Schedule = require('../models/Schedule');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
// const openai = require("openai");
require('dotenv').config();


module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('posts');
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
      const user = await User.findById(id).populate('posts');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
//
module.exports.createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const password = "admin";
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      name: 'Admin',
      phone_number: '0912345678',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();
    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
  
module.exports.getDoctorProfile = async (req, res) => {
  try {
    const { Id } = req.params;
    const doctor = await Doctor.findById(Id).populate('userId', 'id name email').populate('schedules').populate('reviews');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.find({ status: 'approved' }).populate('userId', 'id name').select('id image specialization');
    res.status(200).json(approvedDoctors);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
  
  



















  