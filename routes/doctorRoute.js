const express = require('express');
const router = express.Router();
const {Complete_DoctorProfile,getDoctorProfile} = require('../controllers/doctorController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/completeProfile',checkAuth, Complete_DoctorProfile);
router.post('/getDoctor',checkAuth, getDoctorProfile);

module.exports = router;