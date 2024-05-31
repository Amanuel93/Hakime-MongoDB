const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createReview,updateReview,deleteReview} = require('../controllers/reviewController');
const {getDoctorProfile,getApprovedDoctors} = require('../controllers/userController.js');
const Doctor = require('../models/Doctor.js');

router.post('/reviews/:doctorReviewId', checkAuth, createReview);
router.put('/reviews/:reviewId', checkAuth, updateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.get('/getDoctor/:id', getDoctorProfile);
router.get('/getAllDoctor',getApprovedDoctors);

module.exports = router;

sequelize migration:generate --name Doctor
sequelize migration:generate --name Patient
sequelize migration:generate --name Schedule
sequelize migration:generate --name Appointment
sequelize migration:generate --name Chat
sequelize migration:generate --name Notification
sequelize migration:generate --name Post
sequelize migration:generate --name Review
sequelize migration:generate --name First_Aid

