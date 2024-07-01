const {User,Patient,Doctor,Appointment,Schedule,Review} = require('../models');
const multer = require('multer');
const path = require('path');
const { uploadImage,uploadId_Image,uploadCV,uploadCertificate } = require('../middleware/multerMiddleware');
const mongoose = require('mongoose');

module.exports.getDoctorProfile = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id; // Assuming you have user information stored in req.user after authentication

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is a doctor and retrieve their profile
    const doctor = await Doctor.findOne({ userId })
      .populate('userId', 'name email')
      .populate('schedule', 'day hour minute period')
      .populate('appointments', 'gender day time status duration hourly_rate')
      .populate('reviews', 'doctorId patientId userId name image review_text rating')
      .select('image date_of_birth address specialization');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.Complete_DoctorProfile = async (req, res) => {
  try {
    const decoded = req.userData;
    console.log("Decoded token data:",decoded);
    const userId = decoded.id;
    console.log("User ID from token:", userId);

    const step = parseInt(req.params.step);
    // const {step} = req.params
    switch (step) {
      case 1:
        await Personal_Info(req, res,userId);
        break;
        case 2:
        await Identification_Info(req, res,userId);
        break;
      case 3:
        await Professional_Info(req, res,userId);
        break;
      case 4:
        await Specialization_Info(req, res,userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid step" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Personal Info
const Personal_Info = async (req,res,userId) => {
  try {
    console.log("Received userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      const { date_of_birth, gender, nationality, address, Bio } = req.body;
      const missingFields = [];

      // Check if any required field is missing
      if (typeof gender !== 'string' || !gender.trim()) missingFields.push('gender');
      if (typeof nationality !== 'string' || !nationality.trim()) missingFields.push('nationality');
      if (typeof address !== 'string' || !address.trim()) missingFields.push('address');
      if (typeof Bio !== 'string' || !Bio.trim()) missingFields.push('Bio');

      if (missingFields.length > 0) {
        return res.status(400).json({ message: 'Missing required fields', missingFields });
      }

      try {
        let doctor = await Doctor.findOne({ userId});

        if (doctor) {
          doctor = await doctor.updateOne({ date_of_birth, gender, nationality, address, Bio, image: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor, success: true });
        } else {
          doctor = await Doctor.create({ userId, date_of_birth, gender, nationality, address, Bio, image: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor, success: true });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while updating or creating doctor profile', error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Professional Info
const Professional_Info = async (req, res,userId) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadCertificate(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Certificate upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      const { medical_degrees, medical_school, year_of_graduation, specialization } = req.body;

      try {
        let doctor = await Doctor.findOne({ userId });

        if (doctor) {
          doctor = await doctor.updateOne({ medical_degrees, medical_school, year_of_graduation, specialization, certificate: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor, success: true });
        } else {
          doctor = await Doctor.create({ userId, medical_degrees, medical_school, year_of_graduation, specialization, certificate: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor, success: true });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while updating or creating doctor profile', error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Specialization Info
const Specialization_Info = async (req, res,userId) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadCV(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'CV upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      const { medical_license_number, previous_work_experience, hrRate } = req.body;

      try {
        let doctor = await Doctor.findOne({ userId });

        if (doctor) {
          doctor = await doctor.updateOne({ medical_license_number, previous_work_experience, hourly_rate: hrRate, cv: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor, success: true });
        } else {
          doctor = await Doctor.create({ userId, medical_license_number, previous_work_experience, hourly_rate: hrRate, cv: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor, success: true });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while updating or creating doctor profile', error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Identification Info
const Identification_Info = async (req, res,userId) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadId_Image(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'ID Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      const { passport_or_national_id_no, language_spoken, proficiency_level } = req.body;

      try {
        let doctor = await Doctor.findOne({ userId });

        if (doctor) {
          doctor = await doctor.updateOne({ passport_or_national_id_no, language_spoken, proficiency_level, Id_Image: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor, success: true });
        } else {
          doctor = await Doctor.create({ userId, passport_or_national_id_no, language_spoken, proficiency_level, Id_Image: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor, success: true });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while updating or creating doctor profile', error });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all doctors
module.exports.getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email') // Populate user details
      .select('id name email specialization'); // Select fields to return

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get single doctor profile
module.exports.getSingleDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id)
      .populate('userId', 'name email') // Populate user details
      .populate('schedules', 'day hour minute period') // Populate schedules if available
      .populate('reviews', 'doctorId patientId userId name image review_text rating'); // Populate reviews if available

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


































































































  