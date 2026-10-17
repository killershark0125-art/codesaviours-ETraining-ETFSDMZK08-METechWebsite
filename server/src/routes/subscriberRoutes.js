const express = require('express');
const {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} = require('../controllers/subscriberController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { subscribeValidator } = require('../validators/formValidators');

const router = express.Router();

router.post('/', subscribeValidator, validate, subscribe); // public
router.get('/', adminAuth, getSubscribers);
router.delete('/:id', adminAuth, deleteSubscriber);

module.exports = router;