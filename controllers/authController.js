const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Patient = require('../models/Patient');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// User registration
module.exports.register = async (req, res) => {
  try {
    const { name, phone_number, email, password, role } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ where: { email } });
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
    res.status(201).json({ name, role, token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ where: { email } });
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
    const Id = user.id
    req.user = Id;
    res.status(200).json({ name: user.name ,role: user.role, token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User update
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the request

    // Fetch the user from the database
    const user = await User.findByPk(userId);
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
