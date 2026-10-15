const Lead = require('../models/Lead');

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

module.exports = { createLead };