const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const multer = require('multer');
const path = require('path');

// Set up Multer storage for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Set up Multer storage for CV and certificate uploads
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer upload instance for image
const uploadImage = multer({ storage: imageStorage }).single('image');

// Multer upload instance for CV and certificates
const uploadDocuments = multer({ storage: documentStorage }).fields([
  { name: 'cv', maxCount: 1 },
  { name: 'certificates', maxCount: 10 } // Adjust the maxCount as needed
]);

module.exports.getDoctorProfile = async (req, res) => {
  const  decoded = req.userData;
  const Id = decoded.id; 
  try {
// Check if the user exists
const user = await User.findByPk(Id);
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
// Check if the user is already a doctor
let doctor = await Doctor.findOne({ where: { userId: Id } });
if (!doctor) {
  return res.status(404).json({ message: 'Doctor profile not found' });
}
res.status(200).json(doctor,{include:[Appointment,Schedule]});
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Internal server error' });
}
};

module.exports.Complete_DoctorProfile = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;
    const { step } = req.body;

    switch (step) {
      case 1:
        await Personal_Info(req, res, userId);
        break;
      case 2:
        await Professional_Info(req, res, userId);
        break;
      case 3:
        await Specialization_Info(req, res, userId);
        break;
      case 4:
        await Identification_Info(req, res, userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid step" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function Personal_Info(req, res, userId) {
  try {
    const { gender, nationality, address, Bio } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      let doctor = await Doctor.findOne({ where: { userId } });
      if (doctor) {
        doctor = await doctor.update({ gender,step, nationality, address, Bio, image: req.file.path });
        return res.status(200).json({ message: 'Doctor profile updated successfully', step, doctor });
      } else {
        doctor = await Doctor.create({ userId, gender,step, nationality, address, Bio, image: req.file.path });
        return res.status(201).json({ message: 'Doctor profile created successfully', step, doctor });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function Professional_Info(req, res, userId) {
  try {
    const { medical_degrees, medical_school, year_of_graduation, specialization } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let doctor = await Doctor.findOne({ where: { userId } });
    if (doctor) {
      doctor = await doctor.update({ medical_degrees,step, medical_school, year_of_graduation, specialization });
      return res.status(200).json({ message: 'Doctor profile updated successfully', step, doctor });
    } else {
      doctor = await Doctor.create({ userId, medical_degrees,step, medical_school, year_of_graduation, specialization });
      return res.status(201).json({ message: 'Doctor profile created successfully', step, doctor });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function Specialization_Info(req, res, userId) {
  try {
    const { medical_license_number, previous_work_experience } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadDocuments(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Document upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      let doctor = await Doctor.findOne({ where: { userId } });
      if (doctor) {
        doctor = await doctor.update({
          medical_license_number,
          step,
          certificates: req.files['certificates'].map(file => file.path),
          previous_work_experience,
          cv: req.files['cv'][0].path,
        });
        return res.status(200).json({ message: 'Doctor profile updated successfully', step, doctor });
      } else {
        doctor = await Doctor.create({
          userId,
          medical_license_number,
          step,
          certificates: req.files['certificates'].map(file => file.path),
          previous_work_experience,
          cv: req.files['cv'][0].path,
        });
        return res.status(201).json({ message: 'Doctor profile created successfully', step, doctor });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function Identification_Info(req, res, userId) {
  try {
    const { passport_or_national_id_no, language_spoken, proficiency_level } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let doctor = await Doctor.findOne({ where: { userId } });
    if (doctor) {
      doctor = await doctor.update({ passport_or_national_id_no,step,language_spoken, proficiency_level });
      return res.status(200).json({ message: 'Doctor profile updated successfully', step, doctor });
    } else {
      doctor = await Doctor.create({ userId, passport_or_national_id_no,step,language_spoken, proficiency_level });
      return res.status(201).json({ message: 'Doctor profile completed successfully', step, doctor });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}










 






















































































































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
      let doctor = await Doctor.findOne({ where: { userId: Id } });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      res.status(200).json(doctor,{include:[Appointment,Schedule]});
    } catch (error) {
      console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  