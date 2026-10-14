const Batch = require('../models/Batch');

// GET /api/batches?course=<courseId>
const getBatches = async (req, res) => {
  const filter = {};

  if (req.query.course) {
    filter.course = String(req.query.course);
  }

  const batches = await Batch.find(filter).sort({ startDate: 1 }).lean();

  res.status(200).json({ success: true, data: batches });
};

module.exports = { getBatches };