const { body } = require('express-validator');
const allowedEmailDomains = require('../config/allowedEmailDomains');

const nameField = () =>
  body('name')
    .isString().withMessage('Name is required').bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters');

const phoneField = () =>
  body('phone')
    .isString().withMessage('Phone is required').bail()
    .trim()
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage('Phone must be 7-20 characters (digits, spaces, + or -)');

const emailField = () =>
  body('email')
    .isString().withMessage('Email is required').bail()
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Valid email is required').bail()
    .custom((value) => allowedEmailDomains.includes(value.split('@')[1]))
    .withMessage('Please use an email from a supported provider such as Gmail, iCloud or Outlook');

const createLeadValidator = [
  nameField(),
  phoneField(),
  emailField(),
  body('city')
    .optional({ values: 'falsy' })
    .isString().withMessage('City must be text').bail()
    .trim()
    .isLength({ max: 100 }).withMessage('City must be at most 100 characters'),
  body('service')
    .optional({ values: 'falsy' })
    .isString().withMessage('Service must be text').bail()
    .trim()
    .isLength({ max: 150 }).withMessage('Service must be at most 150 characters'),
  body('message')
    .isString().withMessage('Message is required').bail()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  body('source')
    .isIn(['contact', 'quote']).withMessage('Source must be contact or quote'),
];

const createEnrollmentValidator = [
  nameField(),
  phoneField(),
  emailField(),
  body('university')
    .isString().withMessage('University is required').bail()
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage('University must be 2-150 characters'),
  body('course')
    .isMongoId().withMessage('A valid course is required'),
  body('batch')
    .optional({ values: 'falsy' })
    .isMongoId().withMessage('Batch must be a valid id'),
];

module.exports = { createLeadValidator, createEnrollmentValidator };