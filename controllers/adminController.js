const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

module.exports.getPatientProfile = async (req, res) => {
    try {
        const { id } = req.params;
        // Retrieve a single patient with their associated user information and appointments
        const patient = await Patient.findById(id)
            .populate('userId', 'name email phone_number') // Populate user details
            .populate('appointments', 'patientId doctorId reason day time status duration hourly_rate'); // Populate appointments

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.getDoctorProfile = async (req, res) => {
  try {
      const { id } = req.params;
      // Retrieve a single doctor with their associated user information, schedule, reviews, and appointments
      const doctor = await Doctor.findById(id)
          .populate('userId', 'name email phone_number') // Populate user details
          .populate('schedules', 'day hour minute period') // Populate schedule details
          .populate('reviews', 'doctorId patientId userId name image review_text rating') // Populate reviews
          .populate('appointments', 'patientId doctorId reason day time status duration hourly_rate'); // Populate appointments
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      res.status(200).json(doctor);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getAllPatient = async (req, res) => {
  try {
      // Retrieve all patients with their associated user information
      const patients = await Patient.find()
          .populate('userId', 'name email phone_number');

      res.status(200).json(patients);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
}; 
module.exports.getAllDoctor = async (req, res) => {
  try {
      // Retrieve all doctors with their associated user information
      const doctors = await Doctor.find()
          .populate('userId', 'name email phone_number');

      res.status(200).json(doctors);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.approveDoctor = async (id) => {
  try {
      const doctor = await Doctor.findByIdAndUpdate(id, { status: 'approved' });
      return doctor;
  } catch (error) {
      console.error('Error approving doctor:', error);
      throw error;
  }
};
module.exports.disapproveDoctor = async (id) => {
  try {
      const doctor = await Doctor.findByIdAndUpdate(id, { status: 'not approved' });
      return doctor;
  } catch (error) {
      console.error('Error disapproving doctor:', error);
      throw error;
  }
}
module.exports.getApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.find({ status: 'approved' });
    res.status(200).json(approvedDoctors);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports.getnot_ApprovedDoctors = async (req, res) => {
  try {
    const notApprovedDoctors = await Doctor.find({ status: 'not approved' });
    res.status(200).json(notApprovedDoctors);
  } catch (error) {
    console.error('Error fetching not approved doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.countDoctors = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({ status: 'approved' });
    const notApprovedDoctors = await Doctor.countDocuments({ status: 'not approved' });

    res.status(200).json({
      total: totalDoctors,
      approved: approvedDoctors,
      notApproved: notApprovedDoctors
    });
  } catch (error) {
    console.error('Error counting doctors:', error);
    res.status(500).json({ error: 'An error occurred while counting doctors' });
  }
};

module.exports.countPatients = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    res.status(200).json({
      total: totalPatients,
    });
  } catch (error) {
    console.error('Error counting patients:', error);
    res.status(500).json({ error: 'An error occurred while counting patients' });
  }
};

