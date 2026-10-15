const express = require('express');
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createProjectValidator,
  updateProjectValidator,
} = require('../validators/contentValidators');

const router = express.Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

router.post('/', adminAuth, createProjectValidator, validate, createProject);
router.put('/:id', adminAuth, updateProjectValidator, validate, updateProject);
router.delete('/:id', adminAuth, deleteProject);

module.exports = router;