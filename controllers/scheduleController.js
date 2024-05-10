const Schedule = require('../models/Schedule');
const Doctor = require('../models/Doctor');
    // const  decoded = req.userData;
    // const Id = decoded.id
    // const doctorRow = await Doctor.findOne({ where: { userId:Id } })
    // const doctorId = doctorRow.id;
    module.exports.setDoctorSchedule = async (req, res) => {
      const doctorId = req.userData.doctorId;
      try {
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
        // Check if a schedule already exists for the doctor
        let schedule = await Schedule.findOne({ where: { doctorId: doctorId } });
        if (schedule) {
          // Update existing schedule
          await Schedule.update({
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          }, {
            where: { doctorId: doctorId }
          });
          schedule = await Schedule.findOne({ where: { doctorId} }); // Retrieve updated schedule
          res.status(200).json({ message: 'Doctor schedule updated successfully', schedule });
        } else {
          // Create new schedule
          schedule = await Schedule.create({
            doctorId,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          });
          res.status(200).json({ message: 'Doctor schedule set successfully', schedule });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    

  // module.exports.updateSchedules = async (req, res) => {
  //   const  doctorId  = req.user.doctorId;
  //   try {
  //     const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body;
  //     // Check if a schedule already exists for the doctor
  //     let schedule = await Schedule.findOne({ where: { doctorId : doctorId} });

  //     if (!schedule) {
  //       res.status(200).json("schedule already exists")
  //      }
  //      else{
  //        schedule = await schedule.update({
  //          monday,
  //          tuesday,
  //          wednesday,
  //          thursday,
  //          friday,
  //          saturday,
  //          sunday,
  //        });
  //      }
  //       // Update existing schedule
  //     res.status(200).json({ message: 'Doctor schedule updated  successfully', schedule });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };
  

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
