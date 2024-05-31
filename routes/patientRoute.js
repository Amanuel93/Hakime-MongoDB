const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality,getDoctorProfile} = require('../controllers/patientController.js');
const {getFirstAidById,getAllFirstAids} = require('../controllers/firstAidsController.js');
const {setAppointment} = require('../controllers/appointmentController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/getDoctor/:id',checkAuth, getDoctorProfile);
// router.get('/searchName',checkAuth,searchBy_name);
// router.get('/searchSpecialty',checkAuth,searchBy_speciality);
router.get('/getAllSchedule/:doctorId',checkAuth,getAllSchedulesforPatient);
router.get('/getAllFirstAid',getAllFirstAids);
router.get('/getFirstAid/:id',getFirstAidById);

router.post('/setAppointment',checkAuth, setAppointment);

module.exports = router;