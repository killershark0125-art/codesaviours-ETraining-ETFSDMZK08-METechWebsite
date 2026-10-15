const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Batch = require('../models/Batch');
const httpError = require('../utils/httpError');

const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');

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

// GET /api/enrollments?status=&course=&search=&page=&limit=  (admin)
const getEnrollments = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.course) filter.course = String(req.query.course);

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { university: regex },
    ];
  }

  const [enrollments, total] = await Promise.all([
    Enrollment.find(filter)
      .populate('course', 'title slug')
      .populate('batch', 'startDate mode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: enrollments,
    pagination: buildPagination(page, limit, total),
  });
};

// GET /api/enrollments/:id  (admin)
const getEnrollmentById = async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('course', 'title slug')
    .populate('batch', 'startDate mode')
    .lean();

  if (!enrollment) throw httpError(404, 'Enrollment not found.');

  res.status(200).json({ success: true, data: enrollment });
};

// PATCH /api/enrollments/:id/status  (admin)
// Seats follow the status: cancelling releases the seat, and
// un-cancelling takes one again (if the batch still has room).
const updateEnrollmentStatus = async (req, res) => {
  const { status } = req.body;

  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) throw httpError(404, 'Enrollment not found.');

  const wasCancelled = enrollment.status === 'cancelled';
  const willBeCancelled = status === 'cancelled';

  if (enrollment.batch) {
    if (!wasCancelled && willBeCancelled) {
      await Batch.updateOne(
        { _id: enrollment.batch, seatsTaken: { $gt: 0 } },
        { $inc: { seatsTaken: -1 } }
      );
    } else if (wasCancelled && !willBeCancelled) {
      const claimed = await Batch.findOneAndUpdate(
        { _id: enrollment.batch, $expr: { $lt: ['$seatsTaken', '$totalSeats'] } },
        { $inc: { seatsTaken: 1 } }
      );
      if (!claimed) throw httpError(409, 'This batch is full.');
    }
  }

  enrollment.status = status;
  await enrollment.save();

  res.status(200).json({
    success: true,
    message: 'Enrollment status updated.',
    data: enrollment,
  });
};

module.exports = {   createEnrollment, getEnrollments, getEnrollmentById, updateEnrollmentStatus,};