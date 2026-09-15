const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.get('/', optionalAuth, getCategories);
router.get('/:slug', optionalAuth, getCategoryBySlug);
router.get('/id/:id', protect, authorize('admin'), getCategoryById);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
