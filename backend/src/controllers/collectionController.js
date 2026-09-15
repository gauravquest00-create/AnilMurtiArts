const Collection = require('../models/Collection');
const Category = require('../models/Category');
const Review = require('../models/Review');
const slugifyUtil = require('../utils/slugify');
const { deleteFromCloudinary } = require('../config/cloudinary');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Get all collections with search, filters, pagination
// @route   GET /api/collections
// @access  Public / Admin
const getCollections = async (req, res, next) => {
  try {
    const {
      search,
      category,
      categorySlug,
      type,
      godName,
      featured,
      isLive,
      badge,
      material,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const isAdmin = req.user && req.user.role === 'admin';
    const query = {};

    // 1. Live status constraint: public must ALWAYS get only isLive: true
    if (!isAdmin) {
      query.isLive = true;
    } else if (isLive !== undefined && isLive !== '') {
      query.isLive = isLive === 'true';
    }

    // 2. Category filter by ID or slug
    if (category) {
      query.category = category;
    } else if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) {
        query.category = cat._id;
      } else {
        return sendResponse(res, 200, 'No collections found for category', [], {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          totalPages: 0
        });
      }
    }

    // 3. Collection Type (regular / premium)
    if (type && ['regular', 'premium'].includes(type.toLowerCase())) {
      query.collectionType = type.toLowerCase();
    }

    // 4. Featured filter
    if (featured !== undefined && featured !== '') {
      query.isFeatured = featured === 'true';
    }

    // 5. Sales Badge
    if (badge) {
      query.salesBadge = badge;
    }

    // 6. God Name
    if (godName) {
      query.godName = { $regex: godName, $options: 'i' };
    }

    // 7. Material filter
    if (material) {
      query.material = { $regex: material, $options: 'i' };
    }

    // 8. Global search across name, godName, material, description
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { godName: { $regex: s, $options: 'i' } },
        { material: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { about: { $regex: s, $options: 'i' } }
      ];
    }

    // 9. Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };
    else if (sort === 'name-desc') sortOptions = { name: -1 };
    else if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };
    else if (sort === 'popular') sortOptions = { views: -1, createdAt: -1 };

    // 10. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Collection.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    const collections = await Collection.find(query)
      .populate('category', 'name slug image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return sendResponse(res, 200, 'Collections fetched successfully', collections, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured collections (Public)
// @route   GET /api/collections/featured
// @access  Public
const getFeaturedCollections = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const collections = await Collection.find({ isFeatured: true, isLive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);

    return sendResponse(res, 200, 'Featured collections fetched', collections);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collection by slug
// @route   GET /api/collections/:slug
// @access  Public / Admin
const getCollectionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    const query = { slug };

    if (!isAdmin) {
      query.isLive = true;
    }

    const collection = await Collection.findOne(query).populate('category', 'name slug description');

    if (!collection) {
      return sendError(res, 404, 'Collection not found or currently unavailable');
    }

    // Increment views asynchronously
    Collection.findByIdAndUpdate(collection._id, { $inc: { views: 1 } }).exec();

    // Fetch approved reviews
    const reviews = await Review.find({ collectionId: collection._id, isApproved: true }).sort({ createdAt: -1 });

    const collectionData = collection.toObject();
    collectionData.reviews = reviews;

    return sendResponse(res, 200, 'Collection details fetched', collectionData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get collection by ID (Admin)
// @route   GET /api/collections/id/:id
// @access  Private/Admin
const getCollectionById = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('category', 'name slug');
    if (!collection) {
      return sendError(res, 404, 'Collection not found');
    }
    return sendResponse(res, 200, 'Collection fetched', collection);
  } catch (error) {
    next(error);
  }
};

// @desc    Get related collections
// @route   GET /api/collections/:id/related
// @access  Public
const getRelatedCollections = async (req, res, next) => {
  try {
    const current = await Collection.findById(req.params.id);
    if (!current) {
      return sendResponse(res, 200, 'Related collections', []);
    }

    const related = await Collection.find({
      _id: { $ne: current._id },
      isLive: true,
      $or: [
        { category: current.category },
        ...(current.godName ? [{ godName: current.godName }] : []),
        { collectionType: current.collectionType }
      ]
    })
      .populate('category', 'name slug')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4);

    return sendResponse(res, 200, 'Related collections fetched', related);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = async (req, res, next) => {
  try {
    const {
      name,
      category,
      godName,
      height,
      baseWidth,
      baseDepth,
      dimensionUnit = 'Inches',
      weight,
      weightUnit = 'KG',
      material,
      painting,
      collectionType = 'regular',
      isFeatured = false,
      isLive = true,
      images = [],
      salesBadge = '',
      description = '',
      about = '',
      care = ''
    } = req.body;

    if (!name) return sendError(res, 400, 'Collection name is required');
    if (!category) return sendError(res, 400, 'Category is required');
    if (!height) return sendError(res, 400, 'Height specification is required');
    if (!material) return sendError(res, 400, 'Material specification is required');

    // Generate unique slug
    let slug = slugifyUtil(name);
    const existingSlug = await Collection.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Format and sort images
    const formattedImages = images.map((img, index) => ({
      url: img.url,
      publicId: img.publicId || '',
      alt: img.alt || name,
      isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
      sortOrder: img.sortOrder !== undefined ? img.sortOrder : index
    }));

    const collection = await Collection.create({
      name,
      slug,
      category,
      godName: godName || '',
      height,
      baseWidth: baseWidth || null,
      baseDepth: baseDepth || null,
      dimensionUnit,
      weight: weight || null,
      weightUnit,
      material,
      painting: painting || '24K Gold Foil & Natural Colors',
      collectionType,
      isFeatured: Boolean(isFeatured),
      isLive: Boolean(isLive),
      images: formattedImages,
      salesBadge: salesBadge || '',
      description: description || '',
      about: about || '',
      care: care || ''
    });

    const populated = await Collection.findById(collection._id).populate('category', 'name slug');

    return sendResponse(res, 201, 'Collection created successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res, next) => {
  try {
    let collection = await Collection.findById(req.params.id);
    if (!collection) {
      return sendError(res, 404, 'Collection not found');
    }

    const {
      name,
      category,
      godName,
      height,
      baseWidth,
      baseDepth,
      dimensionUnit,
      weight,
      weightUnit,
      material,
      painting,
      collectionType,
      isFeatured,
      isLive,
      images,
      salesBadge,
      description,
      about,
      care
    } = req.body;

    if (name && name !== collection.name) {
      collection.name = name;
      let newSlug = slugifyUtil(name);
      const slugExists = await Collection.findOne({ slug: newSlug, _id: { $ne: collection._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      collection.slug = newSlug;
    }

    if (category !== undefined) collection.category = category;
    if (godName !== undefined) collection.godName = godName;
    if (height !== undefined) collection.height = height;
    if (baseWidth !== undefined) collection.baseWidth = baseWidth;
    if (baseDepth !== undefined) collection.baseDepth = baseDepth;
    if (dimensionUnit !== undefined) collection.dimensionUnit = dimensionUnit;
    if (weight !== undefined) collection.weight = weight;
    if (weightUnit !== undefined) collection.weightUnit = weightUnit;
    if (material !== undefined) collection.material = material;
    if (painting !== undefined) collection.painting = painting;
    if (collectionType !== undefined) collection.collectionType = collectionType;
    if (isFeatured !== undefined) collection.isFeatured = isFeatured;
    if (isLive !== undefined) collection.isLive = isLive;
    if (salesBadge !== undefined) collection.salesBadge = salesBadge;
    if (description !== undefined) collection.description = description;
    if (about !== undefined) collection.about = about;
    if (care !== undefined) collection.care = care;

    // Handle image updates and cleanup orphaned Cloudinary assets
    if (images !== undefined) {
      const oldPublicIds = (collection.images || [])
        .map(img => img.publicId)
        .filter(Boolean);

      const newPublicIds = images
        .map(img => img.publicId)
        .filter(Boolean);

      // Identify removed images and delete from Cloudinary
      const removedPublicIds = oldPublicIds.filter(id => !newPublicIds.includes(id));
      for (const pubId of removedPublicIds) {
        await deleteFromCloudinary(pubId);
      }

      collection.images = images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId || '',
        alt: img.alt || collection.name,
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
        sortOrder: img.sortOrder !== undefined ? img.sortOrder : index
      }));
    }

    await collection.save();

    const updated = await Collection.findById(collection._id).populate('category', 'name slug');
    return sendResponse(res, 200, 'Collection updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return sendError(res, 404, 'Collection not found');
    }

    // Delete associated Cloudinary images
    if (collection.images && collection.images.length > 0) {
      for (const img of collection.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
    }

    // Delete related reviews and enquiries cleanup if needed
    await Review.deleteMany({ collectionId: collection._id });
    await Collection.findByIdAndDelete(req.params.id);

    return sendResponse(res, 200, 'Collection deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  getFeaturedCollections,
  getCollectionBySlug,
  getCollectionById,
  getRelatedCollections,
  createCollection,
  updateCollection,
  deleteCollection
};
