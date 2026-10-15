const Post = require('../models/Post');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');
const { buildCrudHandlers } = require('../utils/crudHandlers');

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

// GET /api/posts/admin/all?category=&search=&isPublished=&page=&limit=  (admin, includes drafts)
const getAllPostsAdmin = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.category) {
    const text = escapeRegex(String(req.query.category).trim());
    filter.category = new RegExp(`^${text}$`, 'i');
  }

  if (req.query.isPublished === 'true') filter.isPublished = true;
  if (req.query.isPublished === 'false') filter.isPublished = false;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [{ title: regex }, { content: regex }];
  }

  const [posts, total] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: buildPagination(page, limit, total),
  });
};

const crud = buildCrudHandlers(Post, {
  label: 'Post',
  allowedFields: [
    'title', 'slug', 'category', 'coverImage', 'content', 'isPublished', 'publishedAt',
  ],
  // When a post is published and has no date yet, stamp it now.
  beforeSave: (data, existing) => {
    const publishing = data.isPublished === true;
    const alreadyDated = data.publishedAt || (existing && existing.publishedAt);
    if (publishing && !alreadyDated) {
      data.publishedAt = new Date();
    }
  },
});

module.exports = {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost: crud.create,
  updatePost: crud.update,
  deletePost: crud.remove,
};