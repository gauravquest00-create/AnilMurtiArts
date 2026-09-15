const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createEnquiry);
router.get('/', protect, authorize('admin'), getEnquiries);
router.get('/:id', protect, authorize('admin'), getEnquiryById);
router.put('/:id', protect, authorize('admin'), updateEnquiry);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
