const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const httpError = require('../utils/httpError');
const { buildCrudHandlers, fieldError } = require('../utils/crudHandlers');

// GET /api/batches?course=<courseId>
const getBatches = async (req, res) => {
  const filter = {};

  if (req.query.course) {
    filter.course = String(req.query.course);
  }

  const batches = await Batch.find(filter).sort({ startDate: 1 }).lean();

  res.status(200).json({ success: true, data: batches });
};

const crud = buildCrudHandlers(Batch, {
  label: 'Batch',
  // seatsTaken is NOT editable here: enrollments manage it.
  allowedFields: ['course', 'startDate', 'mode', 'totalSeats'],
  beforeSave: async (data, existing) => {
    if (data.course) {
      const courseExists = await Course.exists({ _id: data.course });
      if (!courseExists) throw fieldError(400, 'course', 'Course not found.');
    }
    if (existing && data.totalSeats !== undefined && data.totalSeats < existing.seatsTaken) {
      throw fieldError(
        400,
        'totalSeats',
        `Total seats cannot be less than seats already taken (${existing.seatsTaken}).`
      );
    }
  },
  beforeDelete: async (batch) => {
    const active = await Enrollment.exists({
      batch: batch._id,
      status: { $ne: 'cancelled' },
    });
    if (active) {
      throw httpError(409, 'This batch has active enrollments. Cancel or delete them first.');
    }
  },
});

module.exports = {
  getBatches,
  createBatch: crud.create,
  updateBatch: crud.update,
  deleteBatch: crud.remove,
};