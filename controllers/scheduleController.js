const Schedule = require('../models/Schedule');
const Doctor = require('../models/Doctor');
    // const  decoded = req.userData;
    // const Id = decoded.id
    // const DoctorRow = await Doctor.findOne({ where: { userId:Id } })
module.exports.setDoctorSchedule = async (req, res) => {
  const doctorId = req.userData;
    try {
      const { monday_hours, tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours } = req.body;
      // Check if a schedule already exists for the doctor
      let schedule = await Schedule.findOne({ where: { doctorId :doctorId} });
      if (schedule) {
       res.status(200).json("schedule already exists")
      } else {
        // Create new schedule
        schedule = await Schedule.create({
          doctorId:doctorId,
          monday_hours,
          tuesday_hours,
          wednesday_hours,
          thursday_hours,
          friday_hours,
          saturday_hours,
          sunday_hours,
        });
      }
      res.status(200).json({ message: 'Doctor schedule set successfully', schedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports.updateSchedules = async (req, res) => {
    try {
      const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
      // Check if a schedule already exists for the doctor
      let schedule = await Schedule.findOne({ where: { doctorId : doctorId} });

      if (!schedule) {
        res.status(200).json("schedule already exists")
       }
       else{
         schedule = await schedule.update({
           monday,
           tuesday,
           wednesday,
           thursday,
           friday,
           saturday,
           sunday,
         });
       }
        // Update existing schedule
      res.status(200).json({ message: 'Doctor schedule updated  successfully', schedule });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



module.exports.getDoctorSchedules = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    // Find schedules for the doctor
    // Your logic here...
    res.status(200).json({ message: 'Doctor schedules fetched successfully', schedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
