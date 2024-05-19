'use strict';

const { Op } = require('sequelize');
const moment = require('moment');
const Schedule = require('../models/Schedule');

// Function to convert time in meridian format to 24-hour format
const convertTo24Hour = (time) => {
  return moment(time, ["h:mm A"]).format("HH:mm");
};

module.exports.setDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.userData;
    const { day, initial_time, final_time } = req.body;

    // Convert initial_time and final_time to 24-hour format
    const initialTime24Hour = convertTo24Hour(initial_time);
    const finalTime24Hour = convertTo24Hour(final_time);

    console.log('Initial time (24-hour format):', initialTime24Hour);
    console.log('Final time (24-hour format):', finalTime24Hour);

    // Combine date and time for new initial time and final time
    const newInitialTime = moment(`1970-01-01T${initialTime24Hour}:00Z`).toDate();
    const newFinalTime = moment(`1970-01-01T${finalTime24Hour}:00Z`).toDate();

    // Log the new times to debug
    console.log('New initial time:', newInitialTime);
    console.log('New final time:', newFinalTime);

    if (isNaN(newInitialTime) || isNaN(newFinalTime)) {
      return res.status(400).json({ message: 'Invalid time format provided' });
    }

    // Calculate the time difference between the initial time and final time for the new schedule
    const newTimeDifference = (newFinalTime - newInitialTime) / (1000 * 60); // Convert milliseconds to minutes

    console.log('New time difference (minutes):', newTimeDifference);

    // Check if the new schedule violates the time difference constraints
    if (newTimeDifference < 30) {
      return res.status(400).json({ message: 'The time difference between initial time and final time should be at least 30 minutes' });
    }

    // Check if there's already a schedule for the same day
    const existingSchedules = await Schedule.findAll({
      where: {
        doctorId,
        day
      },
      order: [['initial_time', 'ASC']] // Order schedules by initial_time
    });

    console.log('Existing schedules:', existingSchedules);

    // Check if the new schedule violates the time difference constraints with existing schedules
    for (const schedule of existingSchedules) {
      // Log schedule for debugging
      console.log('Existing schedule:', schedule);
      console.log('Existing initial time (raw):', schedule.initial_time);
      console.log('Existing final time (raw):', schedule.final_time);

      // Parse existing initial and final times
      const existingInitialTime = moment(`1970-01-01T${schedule.initial_time}`).toDate();
      const existingFinalTime = moment(`1970-01-01T${schedule.final_time}`).toDate();

      console.log('Existing initial time:', existingInitialTime);
      console.log('Existing final time:', existingFinalTime);

      if (isNaN(existingInitialTime) || isNaN(existingFinalTime)) {
        console.error('Error parsing existing schedule times:', schedule);
        continue; // Skip this schedule if parsing failed
      }

      // Check for overlapping schedules
      if (
        (newInitialTime < existingFinalTime && newFinalTime > existingInitialTime) // Simplified overlap condition
      ) {
        return res.status(400).json({ message: 'Schedule times overlap with an existing schedule' });
      }

      // Check for 30-minute gap between schedules
      const gapBefore = (newInitialTime - existingFinalTime) / (1000 * 60);
      const gapAfter = (existingInitialTime - newFinalTime) / (1000 * 60);

      console.log('Gap before (minutes):', gapBefore);
      console.log('Gap after (minutes):', gapAfter);

      if ((gapBefore > 0 && gapBefore < 30) || (gapAfter > 0 && gapAfter < 30)) {
        return res.status(400).json({ message: 'There must be at least 30 minutes between consecutive schedules' });
      }
    }

    // Save the schedule to the database
    await Schedule.create({
      doctorId,
      day,
      initial_time: initialTime24Hour,
      final_time: finalTime24Hour
    });

    res.status(201).json({ message: 'Schedule set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
