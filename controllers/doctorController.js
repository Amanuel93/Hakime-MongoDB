const {User,Patient,Doctor,Appointment,Schedule,Review} = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { uploadImage,uploadId_Image,uploadCV,uploadCertificate } = require('../middleware/multerMiddleware');

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
    let doctor = await Doctor.findOne({ 
      where: { userId: Id },
      include:
      [
        {
        model: User,
        attributes: ['name', 'email'], // Select only name and email from the User model
      }, 
      {
        model: Schedule,
        attributes: ['day', 'hour','minute','period'], // Select only name and email from the User model
       },
       {
        model: Appointment,
        attributes: [], // Select only name and email from the User model
       },
       {
        model: Review,
        attributes: ['review_text','rating'], // Select only name and email from the User model
       },
    ],
    Attribute:['id','image','date_of_birth','address','specialization'],
    });
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
        await Identification_Info(req, res,step, userId);
        break;
      case 3:
        await Professional_Info(req, res,step, userId);
        break;
      case 4:
        await Specialization_Info(req, res,step, userId);
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

    uploadImage(req, res, async (err) => {

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
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor,success:true });
        } else {
          doctor = await Doctor.create({ userId,date_of_birth,step,gender,nationality,address,Bio,image: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor,success:true });
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

const Professional_Info = async (req, res, step, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadCertificate(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Document upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      console.log('Request Body:', req.body);
      console.log('File Data:', req.files);

      const { medical_degrees, medical_school, year_of_graduation, specialization } = req.body;
      // const certificatePaths = req.files && req.files['certificate'] ? req.files['certificate'].map(file => file.path) : [];
      const certificatePath = req.file ? req.file.path : null;
      

      try {
        let doctor = await Doctor.findOne({ where: { userId } });
        if (doctor) {
          doctor = await doctor.update({
            medical_degrees,
            medical_school,
            year_of_graduation,
            specialization,
            step,
            certificate: certificatePath
          });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor,success:true });
        } else {
          doctor = await Doctor.create({
            userId,
            medical_degrees,
            medical_school,
            year_of_graduation,
            specialization,
            step,
            certificate: certificatePath
          });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor,success:true });
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
};


const Specialization_Info = async (req, res, step, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadCV(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Document upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      console.log('Request Body:', req.body);
      console.log('File Data:', req.file);

      const { medical_license_number, previous_work_experience, hrRate } = req.body;
      const cvFilePath = req.file ? req.file.path : null;

      try {
        let doctor = await Doctor.findOne({ where: { userId } });
        if (doctor) {
          doctor = await doctor.update({
            medical_license_number,
            previous_work_experience,
            hourly_rate: hrRate,
            step,
            cv: cvFilePath
          });

          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor,success:true });
        } else {
          doctor = await Doctor.create({
            userId,
            medical_license_number,
            previous_work_experience,
            hourly_rate: hrRate,
            step,
            cv: cvFilePath
          });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor,success:true });
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
};

// const  Identification_Info = async(req, res,step, userId) => {
//   try {
//     const { passport_or_national_id_no, language_spoken, proficiency_level } = req.body;

//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let doctor = await Doctor.findOne({ where: { userId } });
//     if (doctor) {
//       doctor = await doctor.update({ passport_or_national_id_no,step,language_spoken, proficiency_level });
//       return (res.status(200).json({ message: 'Doctor profile updated successfully', doctor }));
//     } else {
//       doctor = await Doctor.create({ userId, passport_or_national_id_no,step,language_spoken, proficiency_level });
//       return (res.status(201).json({ message: 'Doctor profile completed successfully', doctor }));
//       // return validateDoctorAttributes(doctor)
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

const Identification_Info = async (req, res,step, userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    uploadId_Image(req, res, async (err) => {

      console.log(req.body);
      const { passport_or_national_id_no, language_spoken, proficiency_level  } = req.body;

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Image upload error', error: err });
      } else if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      try {
        let doctor = await Doctor.findOne({ where: { userId } });

        if (doctor) {
          doctor = await doctor.update({ passport_or_national_id_no,step,language_spoken,proficiency_level,Id_Image: req.file.path });
          return res.status(200).json({ message: 'Doctor profile updated successfully', doctor,success:true });
        } else {
          doctor = await Doctor.create({ userId,passport_or_national_id_no,step,language_spoken,proficiency_level,Id_Image: req.file.path });
          return res.status(201).json({ message: 'Doctor profile created successfully', doctor,success:true });
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
        attributes: ['id','day','hour','minute','period'], // Select only name and email from the User model
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



































































































  