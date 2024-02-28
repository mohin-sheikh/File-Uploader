const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// Serve the HTML form for file upload
router.get('/', fileController.renderForm);

// Handle file upload
router.post('/upload', upload.array('files', 5), uploadController.handleUpload);

module.exports = router;
