const express = require('express');
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createCourseValidator,
  updateCourseValidator,
} = require('../validators/contentValidators');

const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

router.post('/', adminAuth, createCourseValidator, validate, createCourse);
router.put('/:id', adminAuth, updateCourseValidator, validate, updateCourse);
router.delete('/:id', adminAuth, deleteCourse);

module.exports = router;