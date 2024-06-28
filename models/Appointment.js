// models/Appointment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppointmentSchema = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
  patientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  gender: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  day: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'pending' 
  },
  duration: { 
    type: String, 
    required: true 
  },
  hourly_rate: { 
    type: Number, 
    required: true 
  },
  response: { 
    type: String, 
    required: true 
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
