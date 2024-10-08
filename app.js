const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const doctorRoutes = require('./routes/doctorRoute.js');
const patientRoutes = require('./routes/patientRoute.js');
const userRoutes = require('./routes/userRoutes.js');
// const scheduleRoutes = require('./routes/scheduleRoutes.js');
// const appointmentRoutes = require('./routes/appointmentRoutes.js');
const adminRoute = require('./routes/adminRoute.js');
const { createAdmin } = require('./controllers/userController.js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const corsOptions = {
  origin: 'https://hakme.netlify.app', // Replace with the actual origin you want to allow
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoute);
// app.use('/post', postRoutes);
// app.use('/schedule', scheduleRoutes);
// app.use('/appointment', appointmentRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle message reception
  socket.on('message', (message) => {
    // Process the received message
    console.log('Message received:', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Perform cleanup or additional actions as needed
  });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  createAdmin();
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
