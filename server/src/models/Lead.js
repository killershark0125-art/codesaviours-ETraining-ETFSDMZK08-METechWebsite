const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[0-9+\-\s]{7,20}$/, 'Phone must be 7-20 characters (digits, spaces, + or -)'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Valid email is required'],
    },
    city: { type: String, trim: true, maxlength: 100, default: '' },
    service: { type: String, trim: true, maxlength: 150, default: '' },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message must be at most 2000 characters'],
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: { values: ['contact', 'quote'], message: 'Source must be contact or quote' },
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'quoted', 'closed'],
        message: 'Invalid lead status',
      },
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
