const Project = require('../models/Project');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');
const httpError = require('../utils/httpError');
const { buildCrudHandlers, fieldError } = require('../utils/crudHandlers');
const { sectors, reservedSlugs } = require('../config/projectOptions');

// Public endpoints show published projects. A missing field counts as published
// so projects created before drafts existed stay visible.
const PUBLIC_FILTER = { isPublished: { $ne: false } };

const parseSector = (value) => {
  const sector = String(value).toLowerCase();
  if (!sectors.includes(sector)) {
    throw fieldError(400, 'sector', `Sector must be one of: ${sectors.join(', ')}`);
  }
  return sector;
};

// GET /api/projects?sector=&systemType=&page=&limit=
const getProjects = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { ...PUBLIC_FILTER };

  if (req.query.sector) {
    filter.sector = parseSector(req.query.sector);
  }

  if (req.query.systemType) {
    const text = escapeRegex(String(req.query.systemType).trim());
    filter.systemType = new RegExp(`^${text}$`, 'i');
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .select('-problem -solution -result')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: projects,
    pagination: buildPagination(page, limit, total),
  });
};

// GET /api/projects/map?sector=
// Lightweight marker data: every published project that has coordinates.
const getProjectMapData = async (req, res) => {
  const filter = {
    ...PUBLIC_FILTER,
    latitude: { $ne: null },
    longitude: { $ne: null },
  };

  if (req.query.sector) {
    filter.sector = parseSector(req.query.sector);
  }

  const projects = await Project.find(filter)
    .select('title slug city province sector systemType capacity coverImage latitude longitude')
    .sort({ city: 1, title: 1 })
    .limit(500)
    .lean();

  res.status(200).json({ success: true, data: projects });
};

// GET /api/projects/:slug
const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({
    ...PUBLIC_FILTER,
    slug: req.params.slug.toLowerCase(),
  }).lean();

  if (!project) {
    throw httpError(404, 'Project not found.');
  }

  res.status(200).json({ success: true, data: project });
};

// GET /api/projects/admin/all?sector=&isPublished=&search=&page=&limit=  (admin)
const getAllProjectsAdmin = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.sector) {
    filter.sector = parseSector(req.query.sector);
  }

  if (req.query.isPublished === 'true') filter.isPublished = { $ne: false };
  if (req.query.isPublished === 'false') filter.isPublished = false;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [{ title: regex }, { city: regex }];
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

const crud = buildCrudHandlers(Project, {
  label: 'Project',
  allowedFields: [
    'title', 'slug', 'coverImage', 'images',
    'capacity', 'capacityValue', 'capacityUnit',
    'sector', 'systemType', 'city', 'province', 'latitude', 'longitude',
    'description', 'problem', 'solution', 'result',
    'isSample', 'isPublished',
  ],
  beforeSave: (data, existing) => {
    if (data.slug && reservedSlugs.includes(data.slug)) {
      throw fieldError(400, 'slug', 'This slug is reserved. Choose another.');
    }

    // For updates, a field that was not sent keeps its stored value.
    const current = (key) =>
      data[key] !== undefined ? data[key] : existing ? existing[key] : undefined;

    // Capacity: value and unit travel together; the display text is derived.
    const value = current('capacityValue');
    const unit = current('capacityUnit');
    if ((value == null) !== (unit == null)) {
      throw fieldError(
        400,
        value == null ? 'capacityValue' : 'capacityUnit',
        'Capacity value and unit must be given together.'
      );
    }
    if (data.capacityValue !== undefined || data.capacityUnit !== undefined) {
      data.capacity = value != null ? `${value} ${unit}` : '';
    }

    // Coordinates: both or neither.
    const lat = current('latitude');
    const lng = current('longitude');
    if ((lat == null) !== (lng == null)) {
      throw fieldError(
        400,
        lat == null ? 'latitude' : 'longitude',
        'Latitude and longitude must be given together.'
      );
    }
  },
});

module.exports = {
  getProjects,
  getProjectMapData,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProject: crud.create,
  updateProject: crud.update,
  deleteProject: crud.remove,
};