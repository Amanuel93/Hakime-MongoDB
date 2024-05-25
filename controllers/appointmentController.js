const Appointment = require('../models/Appointment');

const Schedule = require('../models/Schedule');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
    // const  decoded = req.userData;
    // const Id = decoded.id
    // const patientRow = await Patient.findOne({ where: { userId:Id } })
    // const doctorRow = await Patient.findOne({ where: { userId:Id } })
    // const patientId = patientRow.id;
    // const doctorId = doctorRow.id;

module.exports.setAppointment = async (req, res) => {

    const  decoded = req.userData;
    const Id = decoded.id
    const patientRow = await Patient.findOne({ where: { userId:Id } })
    const patientId = patientRow.id;
    // const doctorRow = await Doctor.findOne({ where: { userId:Id } })
    // const doctorId = doctorRow.id;
  try {
    const { doctor_id,appointment_day, appointment_date, appointment_time,reason,gender,duration,age,hourly_rate } = req.body;
    // Check if appointment slot is available
    // Your logic here...
    // Create new appoiqqqqntment
    const appointment = await Appointment.create({
      patientId:patientId,
      doctorId:doctor_id,
      appointment_day,
      appointment_date,
      appointment_time,
    });
    res.status(201).json({ message: 'Appointment scheduled successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// module.exports.getDoctorAppointments = async (req, res) => {
//   try {
//     // Find appointments for the patient or doctor
//     const appointments = await Appointment.findAll({
//         where: { doctorId: doctorId },
//         include: [Doctor],
//       });
//     res.status(200).json({ message: 'Appointments fetched successfully', appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };





