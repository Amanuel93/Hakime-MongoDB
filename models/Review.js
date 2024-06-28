// models/post.js

// models/Review.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review_text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  }
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;

