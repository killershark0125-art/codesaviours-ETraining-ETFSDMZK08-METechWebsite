const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const httpError = require('../utils/httpError');

const fieldError = (statusCode, field, message) => {
  const error = httpError(statusCode, message);
  error.errors = [{ field, message }];
  return error;
};

// POST /api/enrollments  (public)
const createEnrollment = async (req, res) => {
  const { name, phone, email, university, course, batch } = req.body;

  const courseDoc = await Course.findById(course).lean();
  if (!courseDoc) {
    throw fieldError(400, 'course', 'Course not found.');
  }

  const alreadyEnrolled = await Enrollment.exists({
    email,
    course,
    status: { $ne: 'cancelled' },
  });
  if (alreadyEnrolled) {
    throw httpError(409, 'You have already enrolled in this course.');
  }

  let seatReserved = false;

  if (batch) {
    // One atomic step: the filter checks the batch belongs to this course
    // AND still has a free seat, and the update takes the seat.
    const claimed = await Batch.findOneAndUpdate(
      { _id: batch, course, $expr: { $lt: ['$seatsTaken', '$totalSeats'] } },
      { $inc: { seatsTaken: 1 } },
      { new: true }
    );

    if (!claimed) {
      const exists = await Batch.exists({ _id: batch, course });
      throw exists
        ? httpError(409, 'This batch is full.')
        : fieldError(400, 'batch', 'Batch not found for this course.');
    }

    seatReserved = true;
  }

  try {
    const enrollment = await Enrollment.create({
      name, phone, email, university, course, batch,
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment request received. We will contact you soon.',
      data: { _id: enrollment._id },
    });
  } catch (error) {
    // If saving failed after taking a seat, give the seat back.
    if (seatReserved) {
      await Batch.updateOne({ _id: batch }, { $inc: { seatsTaken: -1 } });
    }
    throw error;
  }
};

module.exports = { createEnrollment };