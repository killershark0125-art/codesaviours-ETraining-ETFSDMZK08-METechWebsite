const { validationResult } = require('express-validator');
const httpError = require('../utils/httpError');

// Runs after the validator chains. Turns failures into the contract's
// error format: { success:false, message, errors:[{field,message}] }
const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const error = httpError(400, 'Validation failed.');
  error.errors = result
    .array({ onlyFirstError: true })
    .map((e) => ({ field: e.path, message: e.msg }));

  next(error);
};

module.exports = validate;