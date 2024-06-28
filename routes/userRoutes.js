const express = require('express');
const router = express.Router();
const  {checkAuth}  = require('../middleware/authMiddleware')
const {createOrUpdateReview,deleteReview} = require('../controllers/reviewController');
const {getDoctorProfile,getApprovedDoctors} = require('../controllers/userController.js');
const {getPost,getAllPost} = require('../controllers/postController');
const {getAllFirstAids, getFirstAidById} =  require('../controllers/first_AidController.js');
// const {chatgptResponse} =  require('../controllers/hakimeAIController.js');
const {getAccountBalance} =  require('../controllers/accountController.js');

router.post('/reviews/:doctorReviewId', checkAuth, createOrUpdateReview);
router.delete('/reviews/:reviewId', checkAuth, deleteReview);

router.get('/getDoctor/:Id', getDoctorProfile);
router.get('/getAllDoctor',getApprovedDoctors);
router.get('/getPost/:id', getPost);
router.get('/getAllPost', getAllPost);
// router.get('/getAccount', getAccountBalance);

router.get('/getAllFirstAid', getAllFirstAids);
router.get('/getFirstAid/:id', getFirstAidById);
// router.post('/chatGpt',chatgptResponse)





module.exports = router;

