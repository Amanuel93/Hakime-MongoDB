const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createPost,updatePost,deletePost} = require('../controllers/postController');
const {createReview,updateReview,deleteReview} = require('../controllers/reviewController');
const {getPatientProfile,getDoctorProfile,getAllDoctor,getApprovedDoctors} = require('../controllers/adminController.js');

// Create a new post
router.post('/posts', checkAuth, createPost);

// Update a post by ID
router.put('/posts/:id', checkAuth, updatePost);

// Delete a post by ID
router.delete('/posts/:id', checkAuth, deletePost);

router.post('/reviews/:doctorReviewId', checkAuth, createReview);
router.put('/reviews/:reviewId', checkAuth, updateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.get('/getDoctor/:id',checkAuth, getDoctorProfile);
router.get('/getAllDoctor',checkAuth,getApprovedDoctors);

module.exports = router;