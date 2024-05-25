const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Review = require('../models/Review');

module.exports.completePatientProfile = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id // Assuming you have user information stored in req.user after authentication
      const { relevant_allergy, medical_history } = req.body;
  
      // Check if the user exists
      const user = await User.findByPk(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already a patient
      let patient = await Patient.findOne({ where: { userId: Id } });
      if (patient) {
        // If the user is already a patient, update the profile
        patient = await patient.update({ relevant_allergy, medical_history });
        return res.status(200).json({ message: 'Patient profile updated successfully', patient });
      }
  
      // If the user is not already a patient, create a new patient profile
      patient = await Patient.create({ userId: Id, relevant_allergy, medical_history });
      res.status(201).json({ message: 'Patient profile completed successfully', patient });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports.getPatientProfile = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id // Assuming you have user information stored in req.user after authentication
      // Check if the user exists
      const user = await User.findByPk(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Check if the user is already a patient
      let patient = await Patient.findOne({ where: { userId: Id } });
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

    module.exports.searchBy_name = async(req,res) => {
      const { name } = req.query;
      try {
        const doctors = await Doctor.findAll({
          where: {
            [Op.or]: [
              sequelize.where(sequelize.fn('LOWER', sequelize.col('Bio')), 'LIKE', '%' + name.toLowerCase() + '%')
            ]
          }
        });
        res.json(doctors);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
      }
    
    module.exports.searchBy_speciality = async(req,res) => {
      const { specialty } = req.query;
        try {
          const doctors = await Doctor.findAll({
            where: {
              specialization: {
                [Op.like]: '%' + specialty + '%'
              }
            }
          });
          res.json(doctors);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }

      module.exports.getAllDoctor = async (req, res) => {
        try {
          // Retrieve all doctors with their associated user information and picture
          const doctors = await Doctor.findAll({
            include: [
              {
              model: User,
              attributes: ['name', 'email'], // Select only name and email from the User model
            },
          ],
          attributes: ['id', 'specialization', 'nationality','address','hourly_rate','image'],
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

    


    