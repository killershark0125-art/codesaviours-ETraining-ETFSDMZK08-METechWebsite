const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createLeadValidator } = require('../validators/formValidators');
const { leadStatusValidator } = require('../validators/adminValidators');

const router = express.Router();

router.post('/', createLeadValidator, validate, createLead); // public
router.get('/', adminAuth, getLeads);
router.get('/:id', adminAuth, getLeadById);
router.patch('/:id/status', adminAuth, leadStatusValidator, validate, updateLeadStatus);
router.delete('/:id', adminAuth, deleteLead);

module.exports = router;