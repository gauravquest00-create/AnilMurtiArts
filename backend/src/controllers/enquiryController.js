const Enquiry = require('../models/Enquiry');
const Collection = require('../models/Collection');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Create new customer enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, message, collectionId } = req.body;

    if (!name || !phone) {
      return sendError(res, 400, 'Please provide your name and phone number');
    }

    let collectionName = '';
    let collectionSlug = '';
    let collectionSpecs = {};

    if (collectionId) {
      const collection = await Collection.findById(collectionId);
      if (collection) {
        collectionName = collection.name;
        collectionSlug = collection.slug;
        collectionSpecs = {
          material: collection.material,
          height: collection.height,
          painting: collection.painting
        };
      }
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email: email || '',
      message: message || '',
      collectionId: collectionId || null,
      collectionName,
      collectionSlug,
      collectionSpecs,
      status: 'New'
    });

    return sendResponse(res, 201, 'Enquiry submitted successfully', enquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries with filters & pagination
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { collectionName: { $regex: s, $options: 'i' } },
        { message: { $regex: s, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Enquiry.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const enquiries = await Enquiry.find(query)
      .populate('collectionId', 'name slug images height material')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Status counts for badge indicators
    const statusCounts = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const countsMap = { All: total, New: 0, Contacted: 0, 'In Progress': 0, Converted: 0, Closed: 0 };
    statusCounts.forEach(item => {
      countsMap[item._id] = item.count;
    });

    return sendResponse(res, 200, 'Enquiries fetched', enquiries, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      statusCounts: countsMap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private/Admin
const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('collectionId');
    if (!enquiry) {
      return sendError(res, 404, 'Enquiry not found');
    }
    return sendResponse(res, 200, 'Enquiry fetched', enquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and notes
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiry = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return sendError(res, 404, 'Enquiry not found');
    }

    if (status && ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'].includes(status)) {
      enquiry.status = status;
    }

    if (notes !== undefined) {
      enquiry.notes = notes;
    }

    await enquiry.save();

    return sendResponse(res, 200, 'Enquiry updated successfully', enquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return sendError(res, 404, 'Enquiry not found');
    }
    return sendResponse(res, 200, 'Enquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
};
