const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const doctorRoutes = require('./routes/doctorRoute.js');
const patientRoutes = require('./routes/patientRoute.js');
const userRoutes = require('./routes/userRoutes.js');
const scheduleRoutes = require('./routes/scheduleRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const adminRoute = require('./routes/adminRoute.js');
const {createAdmin} = require('./controllers/userController.js');

dotenv.config();

const app = express();

// Middleware
// app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/Appointment', appointmentRoutes);
app.use('/admin',adminRoute); 

const PORT = process.env.PORT || 3000;
createAdmin();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
