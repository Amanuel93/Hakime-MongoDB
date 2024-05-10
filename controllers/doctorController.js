const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
// const { uploadImage, uploadDocuments } = require('../middleware/multerMiddleware');

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "__ " + path.extname(file.originalname));
  }
});

// Multer upload instance for image
const uploadImage = multer({ storage: imageStorage }).single('image');

const uploadDocuments = (req, res, callback) => {
  // Assuming you're using multer for file upload
  const upload = multer({ dest: 'uploads/documents/' }).fields([
    { name: 'certificate', maxCount: 10 },
    { name: 'cv', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      callback(err);
    } else {
      // Extract file paths from req.files object
      const certificateFilePath = req.files['certificate'][0].path;
      const cvFilePath = req.files['cv'][0].path;

      // Pass the file paths to the callback function
      callback(null, { certificateFilePath, cvFilePath });
    }
  });
};

module.exports.getDoctorProfile = async (req, res) => {
  try {
    const  decoded = req.userData;
    const Id = decoded.id // Assuming you have user information stored in req.user after authentication
    // Check if the user exists
    const user = await User.findByPk(Id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user is already a doctor
    let doctor = await Doctor.findOne({ where: { userId: Id },include:[Appointment,Schedule] });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}
}

module.exports.Complete_DoctorProfile = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;

    const step = parseInt(req.params.step);
    // const {step} = req.params

    switch (step) {
      case 1:
        await Personal_Info(req, res,step, userId);
        break;
      case 2:
        await Professional_Info(req, res,step, userId);
        break;
      case 3:
        await Specialization_Info(req, res,step, userId);
        break;
      case 4:
        await Identification_Info(req, res,step, userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid step" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 const Personal_Info = async (req, res,step, userId) => {
  try {

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadImage(req, res, async function (err) {

      console.log(req.body);
      const { date_of_birth,gender, nationality, address, Bio } = req.body;

      const missingFields = [];

    //Check if any required field is missing
    if (typeof gender !== 'string' || !gender.trim()) missingFields.push('gender');
    if (typeof nationality !== 'string' || !nationality.trim()) missingFields.push('nationality');
    if (typeof address !== 'string' || !address.trim()) missingFields.push('address');
    if (typeof Bio !== 'string' || !Bio.trim()) missingFields.push('Bio');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: 'Missing required fields'});
    }

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      try {
        let doctor = await Doctor.findOne({ where: { userId } });

        if (doctor) {
          doctor = await doctor.update({ date_of_birth,step,gender,nationality,address,Bio,image: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
        } else {
          doctor = await Doctor.create({ userId,date_of_birth,step,gender,nationality,address,Bio,image: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while updating or creating doctor profile' });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const Professional_Info = async(req, res,step, userId) => {
  try {
    console.log(req.body);
    const { medical_degrees, medical_school, year_of_graduation, specialization } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let doctor = await Doctor.findOne({ where: { userId } });
    if (doctor) {
      // const { medical_degrees, medical_school, year_of_graduation, specialization } = req.body;
      doctor = await doctor.update({ medical_degrees,step, medical_school, year_of_graduation, specialization });
      return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
    } else {
      doctor = await Doctor.create({ userId, medical_degrees,step, medical_school, year_of_graduation, specialization });
      return res.status(201).json({ message: 'Doctor profile created successfully', doctor });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const Specialization_Info = async(req, res,step, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadDocuments(req, res, async function (err, fileData) {
      console.log('Request Body:', req.body);
      console.log('File Data:', fileData);
      
      const { medical_license_number, previous_work_experience } = req.body;
      const { certificateFilePath, cvFilePath } = fileData;
      console.log('medical_license_number:', medical_license_number);
      console.log('previous_work_experience:', previous_work_experience);

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Document upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      let doctor = await Doctor.findOne({ where: { userId } });
      if (doctor) {
        doctor = await doctor.update({
          medical_license_number,
          previous_work_experience,
          step,
          certificate: certificateFilePath,
          cv: cvFilePath
        });
        return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
      } else {
        doctor = await Doctor.create({
          userId,
          medical_license_number,
          previous_work_experience,
          step,
          certificate: certificateFilePath,
          cv: cvFilePath
        });
        return res.status(201).json({ message: 'Doctor profile created successfully', doctor });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


const  Identification_Info = async(req, res,step, userId) => {
  try {
    const { passport_or_national_id_no, language_spoken, proficiency_level } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let doctor = await Doctor.findOne({ where: { userId } });
    if (doctor) {
      doctor = await doctor.update({ passport_or_national_id_no,step,language_spoken, proficiency_level });
      return (res.status(200).json({ message: 'Doctor profile updated successfully', doctor }));
    } else {
      doctor = await Doctor.create({ userId, passport_or_national_id_no,step,language_spoken, proficiency_level });
      return (res.status(201).json({ message: 'Doctor profile completed successfully', doctor }));
      // return validateDoctorAttributes(doctor)
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// async function validateDoctorAttributes(doctor) {
//   const attributes = Object.values(doctor.dataValues);
//   for (const attribute of attributes) {
//     // Check if the attribute is null or an empty string
//     if (attribute === null || attribute === '') {
//       return false; // Return false if any attribute is null or an empty string
//     }
//   }
//   return true; // Return true if all attributes have values
// }

































































































  