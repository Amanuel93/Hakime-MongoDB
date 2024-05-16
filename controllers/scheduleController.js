'use strict';

const { Op } = require('sequelize');
const Schedule = require('../models/Schedule');

// Function to convert time in meridian format to 24-hour format
const convertTo24Hour = (time) => {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  const isPM = /PM/i.test(time);
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

module.exports.setDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.userData;
    const { day, date, initial_time, final_time } = req.body;

    // Convert initial_time and final_time to 24-hour format
    const initialTime24Hour = convertTo24Hour(initial_time);
    const finalTime24Hour = convertTo24Hour(final_time);

    console.log('Date:', date);
    console.log('Initial time (24-hour format):', initialTime24Hour);
    console.log('Final time (24-hour format):', finalTime24Hour);

    // Combine date and time for new initial time and final time
    const [year, month, dayOfMonth] = date.split('-'); // Split the date string into year, month, and day
    const initialTimeParts = initialTime24Hour.split(':'); // Split the initial time string into hours and minutes
    const finalTimeParts = finalTime24Hour.split(':'); // Split the final time string into hours and minutes

    const newInitialTime = new Date(year, month - 1, dayOfMonth, parseInt(initialTimeParts[0]), parseInt(initialTimeParts[1]));
    const newFinalTime = new Date(year, month - 1, dayOfMonth, parseInt(finalTimeParts[0]), parseInt(finalTimeParts[1]));

    console.log('New initial time:', newInitialTime);
    console.log('New final time:', newFinalTime);

    // Calculate the time difference between the initial time and final time for the new schedule
    const newTimeDifference = (newFinalTime - newInitialTime) / (1000 * 60); // Convert milliseconds to minutes

    console.log('New time difference (minutes):', newTimeDifference);

    // Check if the new schedule violates the time difference constraints
    if (newTimeDifference < 30) {
      return res.status(400).json({ message: 'The time difference between initial time and final time should be at least 30 minutes' });
    }

    console.log('Before existingSchedules query');
    
   
    const dateWithTime = `${date} 00:00:00`;

    // Check if there's already a schedule for the same day and date
    const existingSchedules = await Schedule.findAll({
      where: {
        doctorId,
        day,
        date  // Include time component to match database format
      },
      order: [['initial_time', 'ASC']] // Order schedules by initial_time
    });

    console.log(dateWithTime)
    // console.log('Existings schedules:', existingsSchedules)

    console.log('After existingSchedules query');
    console.log('Existing schedules:', existingSchedules);

    if (existingSchedules.length > 0) {
      // Check if the new schedule violates the time difference constraints with existing schedules
      const lastSchedule = existingSchedules[existingSchedules.length - 1];
      const lastFinalTime = new Date(date + 'T' + lastSchedule.final_time);
      const timeGap = (newInitialTime - lastFinalTime) / (1000 * 60); // Calculate time gap in minutes

      console.log('Last final time:', lastFinalTime);
      console.log('Time gap (minutes):', timeGap);

      if (timeGap < 30) {
        return res.status(400).json({ message: 'There must be at least 30 minutes between consecutive schedules' });
      }
    }

    // Save the schedule to the database
    await Schedule.create({
      doctorId,
      day,
      date,
      initial_time: initialTime24Hour,
      final_time: finalTime24Hour
    });

    res.status(201).json({ message: 'Schedule set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
