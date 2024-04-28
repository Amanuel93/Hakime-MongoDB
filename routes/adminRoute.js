const express = require('express');
const router = express.Router();
const {getPatientProfile,getDoctorProfile,getAllDoctor,getAllPatient,approveDoctor} = require('../controllers/adminController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.get('/getPatient/:id',checkAuth,getPatientProfile);
router.get('/getDoctor/:id',checkAuth, getDoctorProfile);
router.get('/getAllDoctor',checkAuth,getAllDoctor);
router.get('getAllPatient',checkAuth, getAllPatient);

router.patch('/approveDoctor/:id',checkAuth, approveDoctor);

module.exports = router;