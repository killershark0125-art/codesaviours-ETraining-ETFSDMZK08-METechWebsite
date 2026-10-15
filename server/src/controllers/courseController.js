const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');
const httpError = require('../utils/httpError');
const { buildCrudHandlers } = require('../utils/crudHandlers');

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

const crud = buildCrudHandlers(Course, {
  label: 'Course',
  allowedFields: ['title', 'slug', 'tools', 'duration', 'fee', 'outline', 'image'],
  beforeDelete: async (course) => {
    const hasBatches = await Batch.exists({ course: course._id });
    const hasEnrollments = await Enrollment.exists({ course: course._id });
    if (hasBatches || hasEnrollments) {
      throw httpError(409, 'This course has batches or enrollments. Remove them first.');
    }
  },
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse: crud.create,
  updateCourse: crud.update,
  deleteCourse: crud.remove,
};