const express = require('express');
const {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} = require('../controllers/batchController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createBatchValidator,
  updateBatchValidator,
} = require('../validators/contentValidators');

const router = express.Router();

router.get('/', getBatches);

router.post('/', adminAuth, createBatchValidator, validate, createBatch);
router.put('/:id', adminAuth, updateBatchValidator, validate, updateBatch);
router.delete('/:id', adminAuth, deleteBatch);

module.exports = router;