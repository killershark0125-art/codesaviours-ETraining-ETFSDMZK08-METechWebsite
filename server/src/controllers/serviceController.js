const Service = require('../models/service');

// GET /api/services
const getServices = async (req, res) => {
  const services = await Service.find().sort({ order: 1 }).lean();

  res.status(200).json({
    success: true,
    data: services,
  });
};

// GET /api/services/:slug
const getServiceBySlug = async (req, res) => {
  const service = await Service.findOne({
    slug: req.params.slug.toLowerCase(),
  }).lean();

  if (!service) {
    const error = new Error('Service not found.');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: service,
  });
};

module.exports = { getServices, getServiceBySlug };