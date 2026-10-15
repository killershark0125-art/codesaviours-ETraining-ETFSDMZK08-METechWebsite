const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { adminAuth } = require('../middleware/authMiddleware');

// Keep the file in memory, max 5 MB, one file per request.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const router = express.Router();

// adminAuth runs BEFORE multer, so anonymous requests are rejected early.
router.post('/', adminAuth, upload.single('image'), uploadImage);

module.exports = router;