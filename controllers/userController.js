const User = require('../models/User');
const Post = require('../models/Post');
const Doctor  = require('../models/Doctor');
const Patient  = require('../models/Patient');
const Schedule = require('../models/Schedule');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
// const openai = require("openai");
require('dotenv').config();
const { OpenAI } = require('openai');

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
//
 module.exports.createAdmin = async () => {
    try {
      // Check if an admin user already exists
      const existingAdmin = await User.findOne({ where: { role: 'admin' } });
      if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
      }
      
      const password = "admin";
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new admin user
      const adminData = {
        name: 'Admin',
        phone_number: '0912345678', // Change this to the desired admin name
        email: 'admin@example.com', // Change this to the desired admin email
        password: hashedPassword, // Change this to the desired admin password
        role: 'admin'
      };
      const admin = await User.create(adminData);
      console.log('Admin user created successfully:', admin.toJSON());
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  };
  
  module.exports.getDoctorProfile = async (req, res) => {
    try {
      const {Id}   = req.params;
      // Assuming you have user information stored in req.user after authentication
      // Check if the user exists
      // const user = await User.findByPk(Id);
      // if (!user) {
      //   return res.status(404).json({ message: 'User not found' });
      // }
      // Check if the user is already a doctor
      let doctor = await Doctor.findByPk(Id,{ 
        // where: { userId: Id },
        include:
        [
          {
          model: User,
          attributes: ['id','name', 'email'], // Select only name and email from the User model
         }, 
        {
          model: Schedule,
          attributes: ['day', 'hour','minute','period'], // Select only name and email from the User model
        },
        {
          model: Review,
          attributes: ['id','doctorId','patientId','userId','name','image','review_text','rating'], // Select only name and email from the User model
        },
      ],
      attributes:['id','image','date_of_birth','address','specialization'],
      });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      res.status(200).json(doctor);
    } catch (error) {
      console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  }

  module.exports.getApprovedDoctors = async (req, res) => {
    try {
      const approvedDoctors = await Doctor.findAll({
        include:[
          {
            model:User,
            attributes:['id','name'],
          },
        ],
        attributes:['id','image','specialization'],
        where: {
          status: 'approved'
        }
      });
      res.status(200).json(approvedDoctors);
    } catch (error) {
      console.error('Error fetching approved doctors:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

 
  module.exports.chatGptPrompt = async (req, res) => {
    const OpenAPIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    try {
      const { question } = req.body;
  
      const completion = await OpenAPIClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'user', 
            content: question 
          },
          // { 
          //   role: 'user', 
          //   content: question 
          // },
        ],
      })

      res.status(200).json(completion.data.choices[0].message.content);
    } catch (error) {
      console.error('Error creating chat completion:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  };
  
  
  



















  