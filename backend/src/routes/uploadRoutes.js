const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), upload.array('images', 10), uploadImages);
router.post('/delete', protect, authorize('admin'), deleteImage);

module.exports = router;
