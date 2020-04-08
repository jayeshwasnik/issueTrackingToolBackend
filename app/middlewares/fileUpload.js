
const multer = require('multer');

// Multer File upload settings
const DIR = '../public/';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });

// Multer Mime Type Validation size limit is 15MB
var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 15
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });

  module.exports = {
    upload: upload
  }