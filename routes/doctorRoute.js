const express = require('express');
const router = express.Router();
const {Complete_DoctorProfile,getDoctorProfile,getAllDoctor,getSingleDoctorProfile} = require('../controllers/doctorController.js');
const {setDoctorSchedule,deleteDoctorSchedule,getAllSchedulesforDoctor} = require('../controllers/scheduleController.js');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkProfile } = require('../middleware/scheduleMiddleware');

// Custom middleware to handle middleware composition
const composeMiddleware = (middlewares) => {
    return (req, res, next) => {
      let index = 0;
  
      const runNextMiddleware = () => {
        if (index < middlewares.length) {
          const middleware = middlewares[index++];
          middleware(req, res, runNextMiddleware);
        } else {
          next();
        }
      };

      runNextMiddleware();
    };
  };

router.post('/completeProfile/:step',checkAuth, Complete_DoctorProfile);
router.get('/getDoctor',checkAuth, getDoctorProfile);
router.get('/getAllDoctor',checkAuth, getAllDoctor);
router.get('/getDoctor/:id',checkAuth,getSingleDoctorProfile);


router.post('/setSchedule',composeMiddleware([checkAuth, checkProfile]), setDoctorSchedule);
router.get('/getAllSchedule',composeMiddleware([checkAuth, checkProfile]), getAllSchedulesforDoctor);
router.delete('/deleteSchedule/:scheduleId',composeMiddleware([checkAuth, checkProfile]),deleteDoctorSchedule);
// router.patch('/updateSchedule',checkAuth, updateSchedules);`

module.exports = router;