// models/First_Aid.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const FirstAidSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: true
  }
});

const First_Aid = mongoose.model('First_Aid', FirstAidSchema);
module.exports = First_Aid;
