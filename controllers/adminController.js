const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');


module.exports.getPatientProfile = async (req, res) => {
  try {
    const {id} = req.params;
    // Assuming you have user information stored in req.user after authentication
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user is already a patient
    let patient = await Patient.findOne({ where: { userId: id } });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.status(200).json(patient,{include:[Appointment]});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  // Check if the user is already a doctor
  // let doctor = await Doctor.findOne({ where: { userId: Id } });
  // if (!doctor) {
    //   return res.status(404).json({ message: 'Doctor profile not found' });
    // }
    // res.status(200).json(doctor);
  };
  
  module.exports.getDoctorProfile = async (req, res) => {
    try {
      const {id} = req.params // Assuming you have user information stored in req.user after authentication
      // Check if the user exists
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Check if the user is already a doctor
      let doctor = await Doctor.findOne({ where: { userId: id } });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      res.status(200).json(doctor,{include:[Appointment,Schedule]});
    } catch (error) {
      console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.getAllPatient = async (req, res) => {
  try {
    let patient = await Patient.findAll();
    res.status(200).json(patient,{include:[Appointment]});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};

module.exports.getAllDoctor = async (req, res) => {
  try {
    let doctor = await Doctor.findAll();
    res.status(200).json(doctor,{include:[Appointment,Schedule]});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};


module.exports.approveDoctor = async (req, res) => {
  try {
    const {id} = req.params;
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a patient
    let doctor = await Doctor.findOne({ where: { userId: id } });
    if (doctor) {
      // If the user is already a patient, update the profile
      doctor = await Doctor.update({ status: 'active' });
      return res.status(200).json({ message: 'Doctor is approved successfully'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

