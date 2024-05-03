const {Review, Patient, Doctor } = require('../models');

// Controller function to create a review
const createReview = async (req, res) => {

  try {
    const  decoded = req.userData;
    const Id = decoded.id
    const patientRow = await Patient.findOne({ where: { userId:Id } })
    const patientId = patientRow.id;

    // Extract data from request body
    const { doctorId,reviewText, rating } = req.body;

    // Check if the doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if the patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Create the review
    const review = await Review.create({
      doctorId,
      patientId,
      review_text: reviewText,
      rating
    });
    // Send success response
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createReview
};
