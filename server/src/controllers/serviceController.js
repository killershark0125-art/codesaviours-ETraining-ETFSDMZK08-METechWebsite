const Service = require('../models/Service');
const { buildCrudHandlers } = require('../utils/crudHandlers');

// Services stored before the "included" field existed have no such property,
// and .lean() skips schema defaults, so make sure the API always returns an array.
const withDefaults = (service) => ({ ...service, included: service.included || [] });

// GET /api/services
const getServices = async (req, res) => {
  const services = await Service.find().sort({ order: 1 }).lean();

  res.status(200).json({
    success: true,
    data: services.map(withDefaults),
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
    data: withDefaults(service),
  });
};

const crud = buildCrudHandlers(Service, {
  label: 'Service',
  allowedFields: ['title', 'slug', 'icon', 'shortText', 'description', 'included', 'order'],
});

module.exports = {
  getServices,
  getServiceBySlug,
  createService: crud.create,
  updateService: crud.update,
  deleteService: crud.remove,
};