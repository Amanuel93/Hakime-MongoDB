const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createOrUpdateReview,deleteReview} = require('../controllers/reviewController');
const {getDoctorProfile,getApprovedDoctors} = require('../controllers/userController.js');


router.post('/reviews/:doctorReviewId', checkAuth, createOrUpdateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.get('/getDoctor/:id', getDoctorProfile);
router.get('/getAllDoctor',getApprovedDoctors);

module.exports = router;

