const express = require('express');
const router = express.Router();
const {getPatientProfile,getDoctorProfile,getAllDoctor,getAllPatient,approveDoctor,disapproveDoctor,getApprovedDoctors,getnot_ApprovedDoctors,countDoctors,countPatients } = require('../controllers/adminController.js');
const {updateProfile} = require('../controllers/authController.js');
const  {checkAuth}  = require('../middleware/authMiddleware')
const { createFirstAid,getAllFirstAids, getFirstAidById, updateFirstAid,deleteFirstAid} =  require('../controllers/first_AidController.js');

router.get('/getPatient/:id',checkAuth,getPatientProfile);
router.get('/getDoctor/:id',checkAuth, getDoctorProfile);
router.get('/getAllDoctor',checkAuth,getAllDoctor);
router.get('/getAllPatient',checkAuth, getAllPatient);
router.get('/first_aids', getAllFirstAids);
router.get('/first_aids/:id', getFirstAidById);
router.get('/getApprovedDoctor',checkAuth,getApprovedDoctors);
router.get('/getnot_ApprovedDoctor',checkAuth,getnot_ApprovedDoctors);
router.get('/getDoctors_Count',checkAuth,countDoctors);
router.get('/getPatient_Count',checkAuth,countPatients );

router.post('/first_aids', createFirstAid);
router.delete('/first_aids/:id', deleteFirstAid);

router.patch('/first_aids/:id',  updateFirstAid);
router.patch('/approveDoctor/:id',checkAuth, approveDoctor);
router.patch('/dis-approveDoctor/:id',checkAuth, disapproveDoctor);
router.patch('/updateProfile',checkAuth, updateProfile);

module.exports = router;