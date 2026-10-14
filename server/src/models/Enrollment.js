const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
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
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
      minlength: [2, 'University must be at least 2 characters'],
      maxlength: [150, 'University must be at most 150 characters'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled'],
        message: 'Invalid enrollment status',
      },
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);