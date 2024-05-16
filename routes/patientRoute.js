const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality} = require('../controllers/patientController.js');
const {setAppointment} = require('../controllers/appointmentController.js');
const {createReview} = require('../controllers/reviewController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createReview, getAllReviews,getReviewById,updateReview,deleteReview} = require('../controllers/reviewController');

router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/searchName',checkAuth,searchBy_name);
router.get('/searchSpecialty',checkAuth,searchBy_speciality);

router.post('/reviews/:doctorId', checkAuth, createReview);
router.get('/reviews', getAllReviews);
router.get('/reviews/:reviewId', getReviewById);
router.put('/reviews/:reviewId', checkAuth, updateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.post('/setAppointment',checkAuth, setAppointment);
router.post('/createReview',checkAuth, createReview);

module.exports = router;