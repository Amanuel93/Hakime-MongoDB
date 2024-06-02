const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createOrUpdateReview,deleteReview} = require('../controllers/reviewController');
const {getDoctorProfile,getApprovedDoctors} = require('../controllers/userController.js');
const {getPost,getAllPost} = require('../controllers/postController');
const {getAllFirstAids, getFirstAidById} =  require('../controllers/first_AidController.js');
router.post('/reviews/:doctorReviewId', checkAuth, createOrUpdateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.get('/getDoctor/:id', getDoctorProfile);
router.get('/getAllDoctor',getApprovedDoctors);
router.get('/getPost/:id',checkAuth, getPost)
router.get('/getAllPost',checkAuth, getAllPost)

router.get('/getAllFirstAid', getAllFirstAids);
router.get('/getFirstAid/:id', getFirstAidById);

module.exports = router;

