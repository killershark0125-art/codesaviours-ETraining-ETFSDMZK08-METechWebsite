const express = require('express');
const { getPosts, getPostBySlug } = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts);
// Later: GET /admin/all must be registered BEFORE '/:slug',
// otherwise Express would treat "admin" as a slug.
router.get('/:slug', getPostBySlug);

module.exports = router;