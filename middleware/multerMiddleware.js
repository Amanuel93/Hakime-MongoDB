const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "__ " + path.extname(file.originalname));
    }
  });
  
  // Multer upload instance for image
  module.exports.uploadImage = multer({ storage: imageStorage }).single('image');
  
  module.exports.uploadDocuments = (req, res, callback) => {
    // Assuming you're using multer for file upload
    const upload = multer({ dest: 'uploads/documents/' }).fields([
      { name: 'certificate', maxCount: 10 },
      { name: 'cv', maxCount: 1 }
    ]);
  
    upload(req, res, (err) => {
      if (err) {
        callback(err);
      } else {
        // Extract file paths from req.files object
        const certificateFilePath = req.files['certificate'][0].filename;
        const cvFilePath = req.files['cv'][0].filename;
  
        // Pass the file paths to the callback function
        callback(null, { certificateFilePath, cvFilePath });
      }
    });
  };