const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Review = require('../models/Review');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');

  module.exports.completePatientProfile = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id 

      const user = await User.findByPk(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      uploadId_Image(req, res, async (err) => {
  
        console.log(req.body);
        const { relevant_allergy, medical_history  } = req.body;
  
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Image upload error', error: err });
        } else if (err) {
          return res.status(500).json({ message: 'Internal server error', error: err });
        }
  
        try {
          let patient = await Patient.findOne({ where: { userId } });
  
          if (patient) {
            patient = await patient.update({ relevant_allergy, medical_history, image: req.file.path });
            return res.status(200).json({ message: 'Patient profile updated successfully', patient,success:true });
          } else {
            patient = await Patient.create({ relevant_allergy, medical_history,image: req.file.path });
            return res.status(201).json({ message: 'Patient profile created successfully', patient,success:true });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error while updating or creating patient profile' });
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  module.exports.getPatientProfile = async (req, res) => {
    try {
      const decoded = req.userData;
      const Id = decoded.id; // Assuming you have user information stored in req.user after authentication
  
      // Check if the user exists
      const user = await User.findById(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already a patient
      let patient = await Patient.findOne({ userId: mongoose.Types.ObjectId(Id) });
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      res.status(200).json(patient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    
    // Check if the user is already a doctor
    // let doctor = await Doctor.findOne({ userId: mongoose.Types.ObjectId(Id) });
    // if (!doctor) {
    //   return res.status(404).json({ message: 'Doctor profile not found' });
    // }
    // res.status(200).json(doctor);
  };

    // module.exports.searchBy_name = async(req,res) => {
    //   const { name } = req.query;
    //   try {
    //     const doctors = await Doctor.findAll({
    //       where: {
    //         [Op.or]: [
    //           sequelize.where(sequelize.fn('LOWER', sequelize.col('Bio')), 'LIKE', '%' + name.toLowerCase() + '%')
    //         ]
    //       }
    //     });
    //     res.json(doctors);
    //   } catch (error) {
    //     res.status(500).json({ error: 'Internal server error' });
    //   }
    //   }
    
    // module.exports.searchBy_speciality = async(req,res) => {
    //   const { specialty } = req.query;
    //     try {
    //       const doctors = await Doctor.findAll({
    //         where: {
    //           specialization: {
    //             [Op.like]: '%' + specialty + '%'
    //           }
    //         }
    //       });
    //       res.json(doctors);
    //     } catch (error) {
    //       res.status(500).json({ error: 'Internal server error' });
    //     }
    //   }

    module.exports.getAllDoctor = async (req, res) => {
      try {
        // Retrieve all doctors with their associated user information and picture
        const doctors = await Doctor.find().populate([
          {
            path: 'userId',
            model: 'User',
            select: 'id name email', // Select only name and email from the User model
          },
          {
            path: 'reviews',
            model: 'Review',
            select: 'id doctorId patientId userId name image review_text rating', // Select only specific fields from the Review model
          },
        ]).select('id specialization nationality address hourly_rate image');
    
        res.status(200).json(doctors);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    module.exports.getDoctorProfile = async (req, res) => {
      try {
        const { Id } = req.params;
    
        // Check if the user exists
        const user = await User.findById(Id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the user is already a doctor
        let doctor = await Doctor.findOne({ userId: mongoose.Types.ObjectId(Id) }).populate([
          {
            path: 'userId',
            model: 'User',
            select: 'name email', // Select only name and email from the User model
          },
          {
            path: 'schedules',
            model: 'Schedule',
            select: 'day hour minute period', // Select only specific fields from the Schedule model
          },
          {
            path: 'reviews',
            model: 'Review',
            select: 'id doctorId patientId userId name image review_text rating', // Select only specific fields from the Review model
          },
        ]).select('id image date_of_birth address specialization');
    
        if (!doctor) {
          return res.status(404).json({ message: 'Doctor profile not found' });
        }
    
        res.status(200).json(doctor);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

    


    