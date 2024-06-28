const mongoose = require('mongoose');
const { User, Review, Patient, Doctor } = require('../models'); // Ensure the models are correctly imported

// Create or update a review
module.exports.createOrUpdateReview = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;

    // Find patient document
    const patientRow = await Patient.findOne({ userId: userId });
    if (!patientRow) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const patientId = patientRow._id;
    const image = patientRow.image;

    // Find user document
    const userRow = await User.findById(userId);
    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }
    const name = userRow.name;

    const doctorReviewId = mongoose.Types.ObjectId(req.params.doctorReviewId);
    const { review_text, rating } = req.body;
    if (!review_text || !rating) {
      return res.status(400).json({ error: 'Review text and rating are required' });
    }

    const doctor = await Doctor.findById(doctorReviewId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (userRow.role === 'doctor' && doctorReviewId.equals(userRow._id)) {
      return res.status(403).json({ error: 'Doctors cannot review themselves' });
    }

    // Check if the review already exists
    let review = await Review.findOne({
      userId,
      doctorId: doctorReviewId
    });

    if (review) {
      // Update the existing review
      review.review_text = review_text;
      review.rating = rating;
      await review.save();
      return res.status(200).json(review);
    } else {
      // Create a new review
      review = new Review({
        userId,
        name: name,
        image: image,
        patientId: patientId,
        doctorId: doctorReviewId,
        review_text: review_text,
        rating: rating
      });
      await review.save();
      return res.status(201).json(review);
    }
  } catch (error) {
    console.error('Error creating or updating review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all reviews
module.exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId', 'name email'); // Adjust population as needed
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single review by ID
module.exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate('userId', 'name email'); // Adjust population as needed
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a review by ID
module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userData.id;

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Find the patient by user ID
    const patientRow = await Patient.findOne({ userId: userId });
    if (!patientRow) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if the patientId in the review matches the id in req.userData
    if (!review.patientId.equals(patientRow._id)) {
      return res.status(403).json({ error: 'You do not have permission to delete this review' });
    }

    // Delete the review
    await Review.deleteOne({ _id: reviewId });
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
