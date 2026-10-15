const express = require('express');
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
} = require('../controllers/enrollmentController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createEnrollmentValidator } = require('../validators/formValidators');
const { enrollmentStatusValidator } = require('../validators/adminValidators');

const router = express.Router();

router.post('/', createEnrollmentValidator, validate, createEnrollment); // public
router.get('/', adminAuth, getEnrollments);
router.get('/:id', adminAuth, getEnrollmentById);
router.patch('/:id/status', adminAuth, enrollmentStatusValidator, validate, updateEnrollmentStatus);

module.exports = router;