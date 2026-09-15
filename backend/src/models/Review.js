const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: [true, 'Collection reference is required']
    },
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

ReviewSchema.index({ collectionId: 1, isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
