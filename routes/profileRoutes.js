const express = require('express');
const router = express.Router();
const {completeDoctorProfile,completePatientProfile} = require('../controllers/adminController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/patient',checkAuth, completePatientProfile);
router.post('/doctor',checkAuth, completeDoctorProfile);

module.exports = router;