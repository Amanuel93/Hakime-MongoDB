const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const {getAllUsers,getUserById} = require('../controllers/userController.js');

router.get('/getAll', getAllUsers);
router.get('/getUser/:id', getUserById);

module.exports = router;