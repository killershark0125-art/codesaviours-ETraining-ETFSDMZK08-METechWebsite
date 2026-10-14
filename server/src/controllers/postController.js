const Post = require('../models/Post');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');

// GET /api/posts?category=&search=&page=&limit=   (published only)
const getPosts = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isPublished: true };

  if (req.query.category) {
    const text = escapeRegex(String(req.query.category).trim());
    filter.category = new RegExp(`^${text}$`, 'i');
  }

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [{ title: regex }, { content: regex }];
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: buildPagination(page, limit, total),
  });
};

// GET /api/posts/:slug   (published only)
const getPostBySlug = async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug.toLowerCase(),
    isPublished: true,
  }).lean();

  if (!post) {
    const error = new Error('Post not found.');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: post });
};

module.exports = { getPosts, getPostBySlug };