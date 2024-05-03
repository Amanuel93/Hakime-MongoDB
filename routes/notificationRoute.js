const express = require('express');
const router = express.Router();
const { sendNotification, getNotificationsByUser } = require('../controllers/notificationController');

router.post('/notifications', sendNotification);
router.get('/notifications/:userId', getNotificationsByUser);

module.exports = router;