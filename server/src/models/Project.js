const mongoose = require('mongoose');
const { sectors, capacityUnits, pakistanBounds } = require('../config/projectOptions');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case'],
    },
    coverImage: { type: String, trim: true, default: '' },
    images: { type: [String], default: [] },

    // Display text, built from capacityValue + capacityUnit when both are set.
    capacity: { type: String, trim: true, default: '' },
    capacityValue: { type: Number, min: [0.01, 'Capacity value must be greater than 0'] },
    capacityUnit: {
      type: String,
      enum: { values: capacityUnits, message: 'Invalid capacity unit' },
    },

    sector: {
      type: String,
      required: [true, 'Sector is required'],
      enum: { values: sectors, message: `Sector must be one of: ${sectors.join(', ')}` },
    },
    systemType: { type: String, trim: true, default: '' },

    city: { type: String, trim: true, default: '' },
    province: { type: String, trim: true, maxlength: 60, default: '' },
    latitude: {
      type: Number,
      min: [pakistanBounds.minLat, 'Latitude is outside Pakistan'],
      max: [pakistanBounds.maxLat, 'Latitude is outside Pakistan'],
    },
    longitude: {
      type: Number,
      min: [pakistanBounds.minLng, 'Longitude is outside Pakistan'],
      max: [pakistanBounds.maxLng, 'Longitude is outside Pakistan'],
    },

    description: { type: String, trim: true, default: '' },
    problem: { type: String, trim: true, default: '' },
    solution: { type: String, trim: true, default: '' },
    result: { type: String, trim: true, default: '' },

    isSample: { type: Boolean, default: true },
    // Default true keeps projects created before drafts existed visible.
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

projectSchema.index({ isPublished: 1, sector: 1 });

module.exports = mongoose.model('Project', projectSchema);