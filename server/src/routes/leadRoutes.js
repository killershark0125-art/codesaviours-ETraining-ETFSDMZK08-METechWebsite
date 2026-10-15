const express = require('express');
const { createLead } = require('../controllers/leadController');
const validate = require('../middleware/validate');
const { createLeadValidator } = require('../validators/formValidators');

const router = express.Router();

router.post('/', createLeadValidator, validate, createLead);

module.exports = router;