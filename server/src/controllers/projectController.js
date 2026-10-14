const Project = require('../models/Project');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');

// GET /api/projects?sector=&systemType=&page=&limit=
const getProjects = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.sector) {
    filter.sector = String(req.query.sector).toLowerCase();
  }

  if (req.query.systemType) {
    const text = escapeRegex(String(req.query.systemType).trim());
    filter.systemType = new RegExp(`^${text}$`, 'i');
  }

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: projects,
    pagination: buildPagination(page, limit, total),
  });
};

// GET /api/projects/:slug
const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug.toLowerCase(),
  }).lean();

  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: project });
};

module.exports = { getProjects, getProjectBySlug };