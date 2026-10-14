const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    mode: {
      type: String,
      enum: {
        values: ['online', 'onsite'],
        message: 'Mode must be online or onsite',
      },
      required: [true, 'Mode is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    seatsTaken: {
      type: Number,
      default: 0,
      min: [0, 'Seats taken cannot be negative'],
      validate: {
        validator: function (value) {
          return value <= this.totalSeats;
        },
        message: 'Seats taken cannot exceed total seats',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);