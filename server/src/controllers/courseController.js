const Course = require('../models/Course');
const Batch = require('../models/Batch');

// GET /api/courses
const getCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: 1 }).lean();

  res.status(200).json({ success: true, data: courses });
};

// GET /api/courses/:slug  (course + its batches)
const getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({
    slug: req.params.slug.toLowerCase(),
  }).lean();

  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  const batches = await Batch.find({ course: course._id })
    .sort({ startDate: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { ...course, batches },
  });
};

module.exports = { getCourses, getCourseBySlug };