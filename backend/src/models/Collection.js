const mongoose = require('mongoose');

const CollectionImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
});

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artwork/Collection name is required'],
      trim: true,
      maxlength: [200, 'Collection name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    godName: {
      type: String,
      trim: true,
      default: ''
    },
    height: {
      type: String,
      required: [true, 'Height specification is required'],
      trim: true
    },
    baseWidth: {
      type: Number,
      default: null
    },
    baseDepth: {
      type: Number,
      default: null
    },
    dimensionUnit: {
      type: String,
      default: 'Inches'
    },
    weight: {
      type: Number,
      default: null
    },
    weightUnit: {
      type: String,
      default: 'KG'
    },
    material: {
      type: String,
      required: [true, 'Material specification is required'],
      trim: true,
      default: 'White Makrana Marble'
    },
    painting: {
      type: String,
      trim: true,
      default: '24K Gold Foil & Natural Colors'
    },
    collectionType: {
      type: String,
      enum: ['regular', 'premium'],
      default: 'regular',
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    isLive: {
      type: Boolean,
      default: true,
      index: true
    },
    images: {
      type: [CollectionImageSchema],
      default: []
    },
    salesBadge: {
      type: String,
      trim: true,
      enum: ['', 'PRE-ORDER', 'NEW', 'LIMITED', 'EXCLUSIVE', 'SOLD OUT', 'CUSTOM'],
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    about: {
      type: String,
      trim: true,
      default: ''
    },
    care: {
      type: String,
      trim: true,
      default: 'Clean with a soft dry cloth. Avoid acidic cleaners or harsh chemical detergents. Handle with care during relocation.'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for lightning-fast filtered search
CollectionSchema.index({ isLive: 1, isFeatured: 1, collectionType: 1 });
CollectionSchema.index({ category: 1, isLive: 1 });
CollectionSchema.index({ name: 'text', godName: 'text', material: 'text', description: 'text' });

module.exports = mongoose.model('Collection', CollectionSchema);
