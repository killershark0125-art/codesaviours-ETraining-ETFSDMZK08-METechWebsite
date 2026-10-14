const express = require('express');
const { getServices, getServiceBySlug } = require('../controllers/serviceController');

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

module.exports = router;