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

module.exports.personal_Info = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;
    const { gender, nationality, address, Bio } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload the image
    uploadImage(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      // If image upload successful, update or create doctor profile
      let doctor = await Doctor.findOne({ where: { userId } });
      if (doctor) {
        // Update existing doctor profile with image path
        doctor = await doctor.update({ gender, nationality, address, Bio, image: req.file.path });
        return res.status(200).json({ message: 'Doctor profile updated successfully',step:1, doctor });
      } else {
        // Create new doctor profile with image path
        doctor = await Doctor.create({ userId, gender, nationality, address, Bio, image: req.file.path });
        return res.status(201).json({ message: 'Doctor profile created successfully', step:1, doctor });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.specialization_Info = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;
    const { medical_license_number, previous_work_experience } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload CV and certificates
    uploadDocuments(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Document upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      // If CV and certificates upload successful, update or create doctor profile
      let doctor = await Doctor.findOne({ where: { userId } });
      if (doctor) {
        // Update existing doctor profile with CV and certificates paths
        doctor = await doctor.update({
          medical_license_number,
          certificates: req.files['certificates'].map(file => file.path),
          previous_work_experience,
          cv: req.files['cv'][0].path,
        });
        return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
      } else {
        // Create new doctor profile with CV and certificates paths
        doctor = await Doctor.create({
          userId,
          medical_license_number,
          certificates: req.files['certificates'].map(file => file.path),
          previous_work_experience,
          cv: req.files['cv'][0].path,
        });
        return res.status(201).json({ message: 'Doctor profile created successfully',step:3, doctor });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  module.exports.professional_Info = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id // Assuming you have user information stored in req.user after authentication
      const { medical_degrees,medical_school,year_of_graduation, specialization} = req.body;
  
      // Check if the user exists
      const user = await User.findByPk(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already a doctor
      let doctor = await Doctor.findOne({ where: { userId: Id } });
      if (doctor) {
        // If the user is already a doctor, update the profile
        doctor = await doctor.update({ medical_degrees,medical_school,year_of_graduation, specialization });
        return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
      }
  
      // If the user is not already a doctor, create a new doctor profile
      doctor = await Doctor.create({ userId: Id, medical_degrees,medical_school,year_of_graduation, specialization });
      res.status(201).json({ message: 'Step 2 completed successfully',step:2, doctor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports.identification_Info = async (req, res) => {
    try {
      const  decoded = req.userData;
      const Id = decoded.id // Assuming you have user information stored in req.user after authentication
      const { passport_or_national_id_no,language_spoken,proficiency_level} = req.body;
  
      // Check if the user exists
      const user = await User.findByPk(Id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already a doctor
      let doctor = await Doctor.findOne({ where: { userId: Id } });
      if (doctor) {
        // If the user is already a doctor, update the profile
        doctor = await doctor.update({ passport_or_national_id_no,language_spoken,proficiency_level });
        return res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
      }
  
      // If the user is not already a doctor, create a new doctor profile
      doctor = await Doctor.create({ userId: Id, passport_or_national_id_no,language_spoken,proficiency_level });
      res.status(201).json({ message: 'Doctor profile completed successfully',step:4, doctor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
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
  