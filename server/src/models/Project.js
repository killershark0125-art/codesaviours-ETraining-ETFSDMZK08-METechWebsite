const mongoose = require('mongoose');

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
    capacity: { type: String, trim: true, default: '' },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      enum: {
        values: ['residential', 'commercial', 'industrial'],
        message: 'Sector must be residential, commercial or industrial',
      },
    },
    systemType: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    images: { type: [String], default: [] },
    description: { type: String, trim: true, default: '' },
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);