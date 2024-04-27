const express = require('express');
const router = express.Router();
const {getDoctorProfile,personal_Info,specialization_Info,professional_Info,identification_Info} = require('../controllers/doctorController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/personalInfo',checkAuth, personal_Info);
router.post('/specializationInfo',checkAuth, specialization_Info);
router.post('/professionalInfo',checkAuth, professional_Info);
router.post('/identifcationInfo',checkAuth, identification_Info);
router.post('/doctor',checkAuth, getDoctorProfile);

module.exports = router;