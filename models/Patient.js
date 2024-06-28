// models/Patient.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
  image: {
    type: Buffer, // Using Buffer type for binary data
    required: false
  },
  relevant_allergy: {
    type: String,
    required: false
  },
  medical_history: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId, // Referencing the User model
    ref: 'User',
    required: true
  }
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
