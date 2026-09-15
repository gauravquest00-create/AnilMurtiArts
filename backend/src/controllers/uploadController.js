const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { sendResponse, sendError } = require('../utils/apiResponse');

// @desc    Upload single or multiple images directly to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 400, 'No image files uploaded');
    }

    const folder = req.body.folder || 'anil-murti-art/collections';
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    const uploadedAssets = results.map((result, idx) => ({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      alt: req.body.alt || 'Anil Murti Art Artwork',
      isPrimary: idx === 0,
      sortOrder: idx
    }));

    return sendResponse(res, 201, 'Images uploaded to Cloudinary successfully', uploadedAssets);
  } catch (error) {
    console.error(`[Upload Controller Error] ${error.message}`);
    next(error);
  }
};

// @desc    Delete an image from Cloudinary
// @route   POST /api/upload/delete
// @access  Private/Admin
const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return sendError(res, 400, 'publicId is required');
    }

    const result = await deleteFromCloudinary(publicId);
    return sendResponse(res, 200, 'Image deleted from Cloudinary', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImages,
  deleteImage
};
