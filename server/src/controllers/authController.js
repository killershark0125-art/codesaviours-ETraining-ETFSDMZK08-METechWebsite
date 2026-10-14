const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpError = require('../utils/httpError');

// Compared against when the email is unknown, so a missing account
// takes about as long to answer as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.passwordHash : DUMMY_HASH
  );

  // Same message for unknown email and wrong password on purpose.
  if (!user || !passwordMatches) {
    throw httpError(401, 'Invalid email or password.');
  }

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: { token: signToken(user), user: toPublicUser(user) },
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: toPublicUser(req.user) });
};

module.exports = { login, getMe };