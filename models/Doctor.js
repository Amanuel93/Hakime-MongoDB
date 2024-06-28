// models/Doctor.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
  date_of_birth: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  nationality: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  image: {
    type: Buffer,
    required: false
  },
  Bio: {
    type: String,
    required: false
  },
  medical_degrees: {
    type: String,
    required: false
  },
  medical_school: {
    type: String,
    required: false
  },
  year_of_graduation: {
    type: Number,
    required: false
  },
  specialization: {
    type: String,
    required: false
  },
  medical_license_number: {
    type: String,
    required: false
  },
  hourly_rate: {
    type: String,
    required: false
  },
  certificate: {
    type: String,
    required: false
  },
  previous_work_experience: {
    type: String,
    required: false
  },
  cv: {
    type: Buffer,
    required: false
  },
  passport_or_national_id_no: {
    type: String,
    required: false
  },
  language_spoken: {
    type: String,
    required: false
  },
  proficiency_level: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced', 'Fluent'],
    required: false
  },
  Id_Image: {
    type: Buffer,
    required: false
  },
  status: {
    type: String,
    default: 'not approved'
  },
  step: {
    type: Number,
    required: false
  },
  rating_score: {
    type: Number,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
