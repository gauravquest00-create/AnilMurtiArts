const Review = require('../models/Review');
const Collection = require('../models/Collection');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Get reviews for a collection
// @route   GET /api/reviews/collection/:collectionId
// @access  Public
const getCollectionReviews = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    const query = { collectionId };

    if (!isAdmin) {
      query.isApproved = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, 'Reviews fetched', reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res, next) => {
  try {
    const { collectionId, name, rating, comment, city } = req.body;

    if (!collectionId || !name || !rating || !comment) {
      return sendError(res, 400, 'Please provide collectionId, name, rating, and comment');
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return sendError(res, 404, 'Collection not found');
    }

    const review = await Review.create({
      collectionId,
      name,
      rating: Number(rating),
      comment,
      city: city || '',
      isApproved: true // Auto approve by default or set false if strict moderation
    });

    return sendResponse(res, 201, 'Review submitted successfully', review);
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (isApproved !== undefined) review.isApproved = isApproved;
    await review.save();

    return sendResponse(res, 200, 'Review updated', review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return sendError(res, 404, 'Review not found');
    }
    return sendResponse(res, 200, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollectionReviews,
  createReview,
  updateReview,
  deleteReview
};
