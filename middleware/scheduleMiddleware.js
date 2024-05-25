const Doctor = require('../models/Doctor');

async function validateDoctorAttributes(doctor) {
    const attributes = Object.values(doctor.dataValues);
    for (const attribute of attributes) {
      // Check if the attribute is null or an empty string
      if (attribute === null || attribute === '') {
        return false; // Return false if any attribute is null or an empty string
      }
    }
    return true; // Return true if all attributes have values
  }
  
  module.exports.checkProfile = async (req, res, next) => {
    try {
        const userId = req.userData.id;

        // Find the doctor associated with the user ID
        const doctor = await Doctor.findOne({ where: { userId } });
        if (!doctor) {
            return res.status(401).json({
                message: "Doctor profile not found"
            });
        }

        // Check if the doctor profile is complete
        const isValid = await validateDoctorAttributes(doctor);
        if (!isValid) {
            return res.status(401).json({
                message: "Dear doctor, please complete your profile to schedule",
            });
        }

        // Check if the doctor profile is approved
        const status = doctor.status;
        if (status !== 'approved') {
            return res.status(401).json({
                message: "Dear doctor, please wait for your approval"
            });
        }

        // Set additional data on req.userData
      
        req.userData = {
            ...req.userData,
            doctorId: doctor.id
        };

        // Proceed to the next middleware
        next();

    } catch (e) {
        return res.status(401).json({
            message: "Invalid or expired token provided",
            error: e
        })
    }
}