const { Review, Patient, Doctor } = require('../models');

// Create a review
module.exports.createReview = async (req, res) => {
  try {
    const decoded = req.userData;
    const userId = decoded.id;
    const { doctorId } = req.params;

    const { reviewText, rating } = req.body;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const user = await Patient.findByPk(userId); 
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    // Create the review
    const review = await Review.create({
      userId,
      doctorId,
      review_text: reviewText,
      rating
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all reviews
module.exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: [Patient, Doctor] });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single review by ID
module.exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.reviewId, { include: [Patient, Doctor] });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a review by ID
module.exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.review_text = reviewText;
    review.rating = rating;
    await review.save();

    return res.status(200).json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a review by ID
module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
