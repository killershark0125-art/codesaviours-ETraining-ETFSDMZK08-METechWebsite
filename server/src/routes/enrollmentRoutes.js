const express = require('express');
const { createEnrollment } = require('../controllers/enrollmentController');
const validate = require('../middleware/validate');
const { createEnrollmentValidator } = require('../validators/formValidators');

const router = express.Router();

router.post('/', createEnrollmentValidator, validate, createEnrollment);

module.exports = router;