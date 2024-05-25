'use strict';
const Schedule = require('../models/Schedule');

// Function to convert time in meridian format to 24-hour format
const timeToMinutes = (hour, minute, period) => {
  let totalMinutes = parseInt(hour) * 60 + parseInt(minute);
  if (period === 'PM' && hour !== '12') {
    totalMinutes += 12 * 60;
  }
  if (period === 'AM' && hour === '12') {
    totalMinutes -= 12 * 60;
  }
  return totalMinutes;
};

module.exports.setDoctorSchedule = async (req, res) => {
  const {doctorId} = req.userData;
  const {day, hour, minute, period } = req.body;

  if (!day || !hour || !minute || !period) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // Convert the input time to total minutes
  const scheduleMinutes = timeToMinutes(hour, minute, period);

  try {
    // Fetch existing schedules for the same doctor on the same day
    const existingSchedules = await Schedule.findAll({
      where: {
        doctorId: doctorId,
        day: day
      }
    });
    // Check for 30-minute interval conflicts
    for (const schedule of existingSchedules) {
      const existingScheduleMinutes = timeToMinutes(schedule.hour, schedule.minute, schedule.period);

      if (Math.abs(existingScheduleMinutes - scheduleMinutes) < 30) {
        return res.status(400).json({ error: 'Schedules must be at least 30 minutes apart' });
      }
    }
    // Create the new schedule
    const newSchedule = await Schedule.create({
      doctorId,
      day,
      hour,
      minute,
      period
    });
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
