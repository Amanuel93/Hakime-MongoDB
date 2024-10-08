const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.js');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// User registration
module.exports.register = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone_number, email, password, role } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      phone_number,
      email,
      password: hashedPassword,
      role,
    });

    if (role === 'patient') {
      await Patient.create({
        userId: user.id, // Use the user's ID as the foreign key in the patient table
        // Other patient attributes
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    res.status(201).json({ id: user.id, name, role, token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User login
module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    let userId = user.id;
    const doctor = await Doctor.findOne({ userId });
    
    if (doctor && user.role === 'doctor') {
      res.status(200).json({
        message: 'Doctor Logged in successfully',
        name: user.name,
        id: user.id,
        step: user.step,
        role: user.role,
        status: doctor.status,
        token
      });
    } else {
      res.status(200).json({
        message: 'User Logged in successfully',
        name: user.name,
        role: user.role,
        id: user.id,
        token
      });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User update
module.exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    const { name, phone_number, email, password } = req.body;

    // Only update fields that are provided in the request body
    if (name) user.name = name;
    if (phone_number) user.phone_number = phone_number;
    if (email) user.email = email;

    // Hash the new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user data
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    res.status(200).json({ name: user.name, token });
  } catch (error) {
    console.error('Error during user profile update:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};