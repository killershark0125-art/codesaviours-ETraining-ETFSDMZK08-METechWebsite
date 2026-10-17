const Subscriber = require('../models/Subscriber');
const httpError = require('../utils/httpError');
const { getPagination, buildPagination } = require('../utils/pagination');
const escapeRegex = require('../utils/escapeRegex');

// POST /api/subscribers  (public)
const subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
      success: true,
      message: 'Thanks for subscribing.',
      data: { _id: subscriber._id },
    });
  } catch (error) {
    // 11000 = duplicate key: the unique index on "email" caught a repeat.
    if (error.code === 11000) {
      throw httpError(409, 'This email is already subscribed.');
    }
    throw error;
  }
};

// GET /api/subscribers?search=&page=&limit=  (admin)
const getSubscribers = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.search) {
    filter.email = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
  }

  const [subscribers, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Subscriber.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: subscribers,
    pagination: buildPagination(page, limit, total),
  });
};

// DELETE /api/subscribers/:id  (admin)
const deleteSubscriber = async (req, res) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) throw httpError(404, 'Subscriber not found.');

  res.status(200).json({ success: true, message: 'Subscriber deleted.' });
};

module.exports = { subscribe, getSubscribers, deleteSubscriber };