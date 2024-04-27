const express = require('express');
const router = express.Router();
const {completePatientProfile} = require('../controllers/patientController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')

router.post('/patient',checkAuth, completePatientProfile);


module.exports = router;