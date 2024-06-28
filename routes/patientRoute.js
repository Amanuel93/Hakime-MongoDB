const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality,getDoctorProfile} = require('../controllers/patientController.js');
const {getAllSchedulesforPatient} = require('../controllers/scheduleController.js');
const {getFirstAidById,getAllFirstAids} = require('../controllers/first_AidController.js');
const {getAccountBalance} = require('../controllers/accountController.js');
const {setAppointments,completeAppointment,cancelAppointment} = require('../controllers/appointmentController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')
const {deposit,depositCallback} = require('../controllers/depositController.js')
router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/getDoctor/:Id',checkAuth, getDoctorProfile);
// router.get('/searchName',checkAuth,searchBy_name);
// router.get('/searchSpecialty',checkAuth,searchBy_speciality);
router.get('/getAllSchedule/:doctorId',checkAuth,getAllSchedulesforPatient);
router.get('/getAllFirstAid',getAllFirstAids);
router.get('/getFirstAid/:id',getFirstAidById);

router.post('/setAppointment',checkAuth, setAppointments);
// router.get('/completeAppointment/:id',checkAuth,completeAppointment);
// router.get('/cancelAppointment/:id',checkAuth, cancelAppointment);

// router.post('/depoist',deposit)
// router.post('/depoistCallback/:tx_ref',depositCallback)

module.exports = router;