const express = require('express');
const { getDashboard } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Everything under /api/admin requires an admin token.
router.use(adminAuth);

router.get('/dashboard', getDashboard);

module.exports = router;