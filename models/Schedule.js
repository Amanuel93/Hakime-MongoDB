// models/Schedule.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  day: {
    type: String,
    allowNull: true
  },
  hour: {
    type: String,
    allowNull: true
  },
  minute: {
    type: String,
    allowNull: true
  },
  period: {
    type: String,
    enum: ['AM', 'PM'],
    allowNull: true
  }
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;
