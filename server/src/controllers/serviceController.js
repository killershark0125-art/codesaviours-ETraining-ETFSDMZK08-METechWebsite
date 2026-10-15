const Service = require('../models/service');
const { buildCrudHandlers } = require('../utils/crudHandlers');

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

const crud = buildCrudHandlers(Service, {
  label: 'Service',
  allowedFields: ['title', 'slug', 'icon', 'shortText', 'description', 'order'],
});

module.exports = {
  getServices,
  getServiceBySlug,
  createService: crud.create,
  updateService: crud.update,
  deleteService: crud.remove,
};