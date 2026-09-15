const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null
    },
    collectionName: {
      type: String,
      trim: true,
      default: ''
    },
    collectionSlug: {
      type: String,
      trim: true,
      default: ''
    },
    collectionSpecs: {
      material: String,
      height: String,
      painting: String
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'],
      default: 'New',
      index: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

EnquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Enquiry', EnquirySchema);
