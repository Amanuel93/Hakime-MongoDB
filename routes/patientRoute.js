const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality,getDoctorProfile} = require('../controllers/patientController.js');
const {getAllSchedulesforPatient} = require('../controllers/scheduleController.js');
const {getFirstAidById,getAllFirstAids} = require('../controllers/first_AidController.js');
const {setAppointment} = require('../controllers/appointmentController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')
const {deposit} = require('../controllers/deposit')
router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/getDoctor/:Id',checkAuth, getDoctorProfile);
// router.get('/searchName',checkAuth,searchBy_name);
// router.get('/searchSpecialty',checkAuth,searchBy_speciality);
router.get('/getAllSchedule/:doctorId',checkAuth,getAllSchedulesforPatient);
router.get('/getAllFirstAid',getAllFirstAids);
router.get('/getFirstAid/:id',getFirstAidById);

router.post('/setAppointment',checkAuth, setAppointment);
router.post('/depoist',deposit)
module.exports = router;