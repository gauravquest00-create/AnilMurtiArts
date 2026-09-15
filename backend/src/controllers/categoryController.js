const Category = require('../models/Category');
const Collection = require('../models/Collection');
const slugifyUtil = require('../utils/slugify');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Get all categories (public only gets isLive=true, admin gets all)
// @route   GET /api/categories
// @access  Public / Admin
const getCategories = async (req, res, next) => {
  try {
    const query = {};
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isAdmin) {
      query.isLive = true;
    } else if (req.query.isLive !== undefined) {
      query.isLive = req.query.isLive === 'true';
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const categories = await Category.find(query).sort({ displayOrder: 1, createdAt: -1 });

    // Aggregate linked collection counts
    const categoryIds = categories.map(c => c._id);
    const countQuery = { category: { $in: categoryIds } };
    if (!isAdmin) {
      countQuery.isLive = true;
    }

    const counts = await Collection.aggregate([
      { $match: countQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const categoriesWithCount = categories.map(cat => {
      const obj = cat.toObject();
      obj.collectionCount = countMap[cat._id.toString()] || 0;
      return obj;
    });

    return sendResponse(res, 200, 'Categories fetched successfully', categoriesWithCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const query = { slug };
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isAdmin) {
      query.isLive = true;
    }

    const category = await Category.findOne(query);

    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    const collectionCount = await Collection.countDocuments({
      category: category._id,
      ...(isAdmin ? {} : { isLive: true })
    });

    const catObj = category.toObject();
    catObj.collectionCount = collectionCount;

    return sendResponse(res, 200, 'Category details fetched', catObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID (Admin)
// @route   GET /api/categories/id/:id
// @access  Private/Admin
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    const collections = await Collection.find({ category: category._id }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Category fetched', {
      category,
      collections
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isLive, displayOrder } = req.body;

    if (!name) {
      return sendError(res, 400, 'Category name is required');
    }

    let slug = slugifyUtil(name);
    // Ensure slug uniqueness
    let existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || { url: '', publicId: '' },
      isLive: isLive !== undefined ? isLive : true,
      displayOrder: displayOrder || 0
    });

    return sendResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    const { name, description, image, isLive, displayOrder } = req.body;

    if (name && name !== category.name) {
      category.name = name;
      let newSlug = slugifyUtil(name);
      const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      category.slug = newSlug;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isLive !== undefined) category.isLive = isLive;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    await category.save();

    return sendResponse(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    // Check if any collections are associated with this category
    const linkedCollectionsCount = await Collection.countDocuments({ category: category._id });
    if (linkedCollectionsCount > 0) {
      return sendError(
        res,
        400,
        `Cannot delete category. It currently contains ${linkedCollectionsCount} linked artwork collection(s). Reassign or remove the collections first.`
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    return sendResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
