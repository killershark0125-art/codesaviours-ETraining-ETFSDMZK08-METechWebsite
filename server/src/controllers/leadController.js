const Lead = require('../models/Lead');
const httpError = require('../utils/httpError');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');

// POST /api/leads  (public)
const createLead = async (req, res) => {
  // Pick fields one by one. Never pass req.body straight to the model,
  // or a client could set "status" itself.
  const { name, phone, email, city, service, message, source } = req.body;

  const lead = await Lead.create({
    name, phone, email, city, service, message, source,
  });

  res.status(201).json({
    success: true,
    message: 'Thank you. Your message has been received.',
    data: { _id: lead._id },
  });
};

// GET /api/leads?status=&source=&search=&page=&limit=  (admin)
const getLeads = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.source) filter.source = String(req.query.source);

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }, { message: regex }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: buildPagination(page, limit, total),
  });
};

// GET /api/leads/:id  (admin)
const getLeadById = async (req, res) => {
  const lead = await Lead.findById(req.params.id).lean();
  if (!lead) throw httpError(404, 'Lead not found.');

  res.status(200).json({ success: true, data: lead });
};

// PATCH /api/leads/:id/status  (admin)
const updateLeadStatus = async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).lean();

  if (!lead) throw httpError(404, 'Lead not found.');

  res.status(200).json({ success: true, message: 'Lead status updated.', data: lead });
};

module.exports = { createLead, getLeads, getLeadById, updateLeadStatus };