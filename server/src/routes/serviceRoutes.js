const express = require('express');
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createServiceValidator,
  updateServiceValidator,
} = require('../validators/contentValidators');

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

router.post('/', adminAuth, createServiceValidator, validate, createService);
router.put('/:id', adminAuth, updateServiceValidator, validate, updateService);
router.delete('/:id', adminAuth, deleteService);

module.exports = router;