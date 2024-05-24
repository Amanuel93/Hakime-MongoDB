const multer = require('multer');
const path = require('path');

// Image storage configuration
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "__ " + path.extname(file.originalname));
    }
  });

  const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/documents/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "__" + path.extname(file.originalname));
    }
  });
  
  // Multer upload instance for image
  module.exports.uploadImage = multer({ storage: imageStorage }).single('image');
  module.exports.uploadId_Image = multer({ storage: imageStorage }).single('Id_Image');
  module.exports.uploadCV = multer({ storage: documentStorage }).single('cv');
  module.exports.uploadCertificate = multer({ storage: documentStorage }).single('certificate');