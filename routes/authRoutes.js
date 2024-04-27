const express = require('express');
const multer = require('multer');
const path = require('path');
const { register, login, updateUser } = require('../controllers/authController.js');
const {checkAuth} = require('../middleware/authMiddleware');


const router = express.Router();

// Multer configuration for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads'); // Define the destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//       // Define the filename for uploaded files
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'), false);
//     }
//   };

// const upload = multer({ storage: storage,limits:{fileSize:1024*1024*10},fileFilter: fileFilter });

router.post('/register', register);
router.post('/login', login);

module.exports = router;
