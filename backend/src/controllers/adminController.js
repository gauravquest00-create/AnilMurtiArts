const Collection = require('../models/Collection');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get all admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCollections,
      liveCollections,
      hiddenCollections,
      featuredCollections,
      premiumCollections,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      convertedEnquiries,
      inProgressEnquiries,
      recentEnquiries,
      recentCollections
    ] = await Promise.all([
      Collection.countDocuments(),
      Collection.countDocuments({ isLive: true }),
      Collection.countDocuments({ isLive: false }),
      Collection.countDocuments({ isFeatured: true }),
      Collection.countDocuments({ collectionType: 'premium' }),
      Category.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'Converted' }),
      Enquiry.countDocuments({ status: 'In Progress' }),
      Enquiry.find().sort({ createdAt: -1 }).limit(6).populate('collectionId', 'name slug'),
      Collection.find().sort({ createdAt: -1 }).limit(6).populate('category', 'name')
    ]);

    const stats = {
      totalCollections,
      liveCollections,
      hiddenCollections,
      featuredCollections,
      premiumCollections,
      totalCategories,
      totalEnquiries,
      newEnquiries,
      convertedEnquiries,
      inProgressEnquiries,
      recentEnquiries,
      recentCollections
    };

    return sendResponse(res, 200, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
