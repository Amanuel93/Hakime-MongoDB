// const User = require('../models/User');
// const Patient = require('../models/Patient');
// const Doctor = require('../models/Doctor');

// module.exports.getNotification = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have user information stored in req.user after authentication
//     const { relevant_allergy, medical_history } = req.body;

//     // Check if the user exists
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the user is already a patient
//     let patient = await Patient.findOne({ where: { user_id: userId } });
//     if (patient) {
//       // If the user is already a patient, update the profile
//       patient = await patient.update({ relevant_allergy, medical_history });
//       return res.status(200).json({ message: 'Patient profile updated successfully', patient });
//     }

//     // If the user is not already a patient, create a new patient profile
//     patient = await Patient.create({ user_id: userId, relevant_allergy, medical_history });
//     res.status(201).json({ message: 'Patient profile completed successfully', patient });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

