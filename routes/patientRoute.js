const express = require('express');
const router = express.Router();
const {completePatientProfile,getPatientProfile,searchBy_name,searchBy_speciality} = require('../controllers/patientController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/patient',checkAuth, completePatientProfile);
router.get('/getpatient',checkAuth,getPatientProfile);
router.get('/searchName',checkAuth,searchBy_name);
router.get('/searchSpecialty',checkAuth,searchBy_speciality);

module.exports = router;