const express = require('express');
const router = express.Router();
const {
  getCollections,
  getFeaturedCollections,
  getCollectionBySlug,
  getCollectionById,
  getRelatedCollections,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.get('/', optionalAuth, getCollections);
router.get('/featured', getFeaturedCollections);
router.get('/id/:id', protect, authorize('admin'), getCollectionById);
router.get('/:id/related', getRelatedCollections);
router.get('/:slug', optionalAuth, getCollectionBySlug);
router.post('/', protect, authorize('admin'), createCollection);
router.put('/:id', protect, authorize('admin'), updateCollection);
router.delete('/:id', protect, authorize('admin'), deleteCollection);

module.exports = router;
