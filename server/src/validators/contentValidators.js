const { body } = require('express-validator');

const { sectors, systemTypes, capacityUnits, pakistanBounds } = require('../config/projectOptions');

// An uploaded image path or a normal http(s) URL. Blocks things like javascript: links.
const isImageRef = (value) =>
  value === '' ||
  /^\/uploads\/[A-Za-z0-9._-]+$/.test(value) ||
  /^https?:\/\/\S+$/i.test(value);

// On update every field is optional; on create the required ones must be present.
const field = (name, isUpdate) => (isUpdate ? body(name).optional() : body(name));

const text = (name, label, max, isUpdate) =>
  field(name, isUpdate)
    .isString().withMessage(`${label} is required`).bail()
    .trim()
    .isLength({ min: 1, max }).withMessage(`${label} must be 1-${max} characters`);

const optionalText = (name, label, max) =>
  body(name)
    .optional()
    .isString().withMessage(`${label} must be text`).bail()
    .trim()
    .isLength({ max }).withMessage(`${label} must be at most ${max} characters`);

const slug = (isUpdate) =>
  field('slug', isUpdate)
    .isString().withMessage('Slug is required').bail()
    .trim()
    .toLowerCase()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be lowercase kebab-case, for example solar-pv');

const stringArray = (name, label, maxItems) => [
  body(name)
    .optional()
    .isArray({ max: maxItems }).withMessage(`${label} must be a list of at most ${maxItems} items`),
  body(`${name}.*`)
    .isString().withMessage(`Each ${label} entry must be text`).bail()
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage(`Each ${label} entry must be 1-500 characters`),
];

const serviceRules = (isUpdate) => [
  text('title', 'Title', 120, isUpdate),
  slug(isUpdate),
  optionalText('icon', 'Icon', 50),
  text('shortText', 'Short text', 250, isUpdate),
  optionalText('description', 'Description', 5000),
    ...stringArray('included', 'Included items', 20),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a whole number, 0 or more').toInt(),
];

const courseRules = (isUpdate) => [
  text('title', 'Title', 150, isUpdate),
  slug(isUpdate),
  ...stringArray('tools', 'Tools', 30),
  optionalText('duration', 'Duration', 100),
  body('fee').optional().isFloat({ min: 0 }).withMessage('Fee must be a number, 0 or more').toFloat(),
  ...stringArray('outline', 'Outline', 50),
  optionalText('image', 'Image', 300),
];

const batchRules = (isUpdate) => [
  field('course', isUpdate).isMongoId().withMessage('A valid course is required'),
  field('startDate', isUpdate)
    .isISO8601().withMessage('Start date must be a valid date, for example 2026-12-01')
    .toDate(),
  field('mode', isUpdate).isIn(['online', 'onsite']).withMessage('Mode must be online or onsite'),
  field('totalSeats', isUpdate)
    .isInt({ min: 1 }).withMessage('Total seats must be a whole number of at least 1')
    .toInt(),
];

const projectRules = (isUpdate) => [
  text('title', 'Title', 150, isUpdate),
  slug(isUpdate),
  body('coverImage')
    .optional()
    .isString().withMessage('Cover image must be text').bail()
    .trim()
    .custom(isImageRef)
    .withMessage('Cover image must be an uploaded image (/uploads/...) or an http(s) URL'),
  ...stringArray('images', 'Images', 20),
  body('images.*')
    .custom(isImageRef)
    .withMessage('Each gallery image must be an uploaded image (/uploads/...) or an http(s) URL'),
  optionalText('capacity', 'Capacity', 100),
  body('capacityValue')
    .optional({ values: 'null' })
    .isFloat({ gt: 0 }).withMessage('Capacity value must be a number greater than 0')
    .toFloat(),
  body('capacityUnit')
    .optional({ values: 'null' })
    .isIn(capacityUnits).withMessage(`Capacity unit must be one of: ${capacityUnits.join(', ')}`),
  field('sector', isUpdate)
    .isIn(sectors).withMessage(`Sector must be one of: ${sectors.join(', ')}`),
  body('systemType')
    .optional({ values: 'falsy' })
    .isIn(systemTypes).withMessage(`System type must be one of: ${systemTypes.join(', ')}`),
  optionalText('city', 'City', 100),
  optionalText('province', 'Province', 60),
  body('latitude')
    .optional({ values: 'null' })
    .isFloat({ min: pakistanBounds.minLat, max: pakistanBounds.maxLat })
    .withMessage(`Latitude must be a number between ${pakistanBounds.minLat} and ${pakistanBounds.maxLat}`)
    .toFloat(),
  body('longitude')
    .optional({ values: 'null' })
    .isFloat({ min: pakistanBounds.minLng, max: pakistanBounds.maxLng })
    .withMessage(`Longitude must be a number between ${pakistanBounds.minLng} and ${pakistanBounds.maxLng}`)
    .toFloat(),
  optionalText('description', 'Description', 5000),
  optionalText('problem', 'Problem', 5000),
  optionalText('solution', 'Solution', 5000),
  optionalText('result', 'Result', 5000),
  body('isSample').optional().isBoolean().withMessage('isSample must be true or false').toBoolean(),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be true or false').toBoolean(),
];

const postRules = (isUpdate) => [
  text('title', 'Title', 200, isUpdate),
  slug(isUpdate),
  optionalText('category', 'Category', 100),
  optionalText('coverImage', 'Cover image', 300),
  field('content', isUpdate)
    .isString().withMessage('Content is required').bail()
    .trim()
    .notEmpty().withMessage('Content cannot be empty'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be true or false').toBoolean(),
  body('publishedAt').optional().isISO8601().withMessage('publishedAt must be a valid date').toDate(),
];

module.exports = {
  createServiceValidator: serviceRules(false),
  updateServiceValidator: serviceRules(true),
  createCourseValidator: courseRules(false),
  updateCourseValidator: courseRules(true),
  createBatchValidator: batchRules(false),
  updateBatchValidator: batchRules(true),
  createProjectValidator: projectRules(false),
  updateProjectValidator: projectRules(true),
  createPostValidator: postRules(false),
  updatePostValidator: postRules(true),
};