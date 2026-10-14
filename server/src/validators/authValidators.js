const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .isString().withMessage('Email is required').bail()
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Valid email is required'),

  body('password')
    .isString().withMessage('Password is required').bail()
    .notEmpty().withMessage('Password is required').bail()
    .isLength({ max: 128 }).withMessage('Password is too long'),
];

module.exports = { loginValidator };