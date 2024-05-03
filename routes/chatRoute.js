const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByUser } = require('../controllers/chatController');

router.post('/message', sendMessage);
router.get('/messages/:userId', getMessagesByUser);

module.exports = router;