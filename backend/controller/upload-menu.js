const multer = require('multer');

const configStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './menu-image');
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: configStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!filetypes.includes(file.mimetype)) {
      return cb(null, false, new Error('Invalid type of file'));
    }
    const maxSize = (1 * 1024 * 1024);
    const fileSize = req.headers['content-length'];
    if (fileSize > maxSize) {
      return cb(null, false, new Error('File size is too large'));
    }
    cb(null, true);
  }
});

module.exports = upload;