const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality} = require('../controllers/patientController.js');
const {setAppointment} = require('../controllers/appointmentController.js');
const {getDoctorProfile} = require('../controllers/adminController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/getDoctor/:id',checkAuth, getDoctorProfile);
router.get('/searchName',checkAuth,searchBy_name);
router.get('/searchSpecialty',checkAuth,searchBy_speciality);

router.post('/setAppointment',checkAuth, setAppointment);

module.exports = router;