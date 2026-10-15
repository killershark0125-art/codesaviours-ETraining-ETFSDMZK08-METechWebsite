const { body } = require('express-validator');

const leadStatusValidator = [
  body('status')
    .isString().withMessage('Status is required').bail()
    .isIn(['new', 'contacted', 'quoted', 'closed'])
    .withMessage('Status must be new, contacted, quoted or closed'),
];

const enrollmentStatusValidator = [
  body('status')
    .isString().withMessage('Status is required').bail()
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be pending, confirmed or cancelled'),
];

module.exports = { leadStatusValidator, enrollmentStatusValidator };