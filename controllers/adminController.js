const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');


module.exports.getPatientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve a single patient with their associated user information and picture
    const patient = await Patient.findByPk(id, {
      include: {
        model: User,
        attributes: ['name', 'email'], // Select only name and email from the User model
      },
      attributes: ['id', 'image'], // Select patient ID and picture from the Patient model
    });

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
    // Retrieve a single doctor with their associated user information and picture
    const doctor = await Doctor.findByPk(id, {
      include: [
        {
        model: User,
        attributes: ['name', 'email'], // Select only name and email from the User model
        },
      {
        model: Schedule,
        attributes: ['id'], // Select only name and email from the User model
       },
       {
        model: Review,
        attributes: ['review_text','rating'], // Select only name and email from the User model
       },
    ],
    });

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
    // Retrieve all patients with their associated user information and picture
    const patients = await Patient.findAll({
      include: [
        {
        model: User,
        attributes: ['name', 'email'], // Select only name and email from the User model
       },
       {
        model: Appointment,
        attributes: [], // Select only name and email from the User model
       },
    ],
      attributes: ['id', 'image'], // Select patient ID and picture from the Patient model
      where: {
        // Add conditions if needed
      }
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};
    

module.exports.getAllDoctor = async (req, res) => {
  try {
    // Retrieve all doctors with their associated user information and picture
    const doctors = await Doctor.findAll({
      include: [
        {
        model: User,
        attributes: ['name', 'email'], // Select only name and email from the User model
      }, 
      {
        model: Schedule,
        attributes: ['monday', 'tuesday','wednesday', 'thursday','friday', 'saturday','sunday'], // Select only name and email from the User model
       },
       {
        model: Appointment,
        attributes: [], // Select only name and email from the User model
       },
    ],
      where: {
        // Add conditions if needed
      }
    });
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } 
};

module.exports.approveDoctor = async (req, res) => {
  try {
    const {id} = req.params;
    // Check if the user exists

    let doctor = await Doctor.findByPk(id);
    if (doctor.status === 'approved') {
      return res.status(400).json({ message: "Doctor status cannot be updated because it's already approved." });
    }else if(doctor) {
      // If the user is already a patient, update the profile
      doctor = await Doctor.update({ status: 'approved' } ,{ where: { id } });
      return res.status(200).json({ message: 'Doctor is approved successfully'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.disapproveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the doctor exists
    let doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }
    if (doctor.status === 'not approved') {
      return res.status(400).json({ message: "Doctor status cannot be updated because it's already not approved." });
    }else {
      // If the doctor exists and is approved, update the profile to disapproved
      await Doctor.update({ status: 'not approved' }, { where: { id } });
      return res.status(200).json({ message: 'Doctor is disapproved successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports.getApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.findAll({
      where: {
        status: 'approved'
      }
    });
    res.status(200).json(approvedDoctors);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.getnot_ApprovedDoctors = async (req, res) => {
  try {
    const approvedDoctors = await Doctor.findAll({
      where: {
        status: 'not approved'
      }
    });
    res.status(200).json(approvedDoctors);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.countDoctors = async (req, res) => {
  try {
    const totalDoctors = await Doctor.count();
    const approvedDoctors = await Doctor.count({ where: { status: 'approved' } });
    const notApprovedDoctors = await Doctor.count({ where: { status: 'not approved' } });

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
    const totalPatients = await Patient.count();

    res.status(200).json({
      total: totalPatients,
    });
  } catch (error) {
    console.error('Error counting patient:', error);
    res.status(500).json({ error: 'An error occurred while counting patients' });
  }
};


