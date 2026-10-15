const express = require('express');
const {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { adminAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createPostValidator,
  updatePostValidator,
} = require('../validators/contentValidators');

const router = express.Router();

router.get('/', getPosts);
// MUST come before '/:slug', or Express would treat "admin" as a slug.
router.get('/admin/all', adminAuth, getAllPostsAdmin);
router.get('/:slug', getPostBySlug);

router.post('/', adminAuth, createPostValidator, validate, createPost);
router.put('/:id', adminAuth, updatePostValidator, validate, updatePost);
router.delete('/:id', adminAuth, deletePost);

module.exports = router;