const express = require('express');
const router = express.Router();
const {
  getCollectionReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.get('/collection/:collectionId', optionalAuth, getCollectionReviews);
router.post('/', createReview);
router.put('/:id', protect, authorize('admin'), updateReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
