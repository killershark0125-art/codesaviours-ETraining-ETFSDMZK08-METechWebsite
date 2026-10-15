const httpError = require('./httpError');

// Error with a field-level entry, matching the API contract's errors array.
const fieldError = (statusCode, field, message) => {
  const error = httpError(statusCode, message);
  error.errors = [{ field, message }];
  return error;
};

// Builds create / update / remove handlers for any Mongoose model.
//   allowedFields: the ONLY body fields accepted (blocks mass assignment)
//   beforeSave(data, existingDoc): optional business rules (existingDoc is null on create)
//   beforeDelete(doc): optional check that can block deletion
const buildCrudHandlers = (Model, options) => {
  const { label, allowedFields, beforeSave, beforeDelete } = options;

  const pickFields = (body) => {
    const data = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    return data;
  };

  const create = async (req, res) => {
    const data = pickFields(req.body);
    if (beforeSave) await beforeSave(data, null);

    const doc = await Model.create(data);

    res.status(201).json({ success: true, message: `${label} created.`, data: doc });
  };

  // PUT updates only the fields that were sent.
  const update = async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw httpError(404, `${label} not found.`);

    const data = pickFields(req.body);
    if (beforeSave) await beforeSave(data, doc);

    doc.set(data);
    await doc.save();

    res.status(200).json({ success: true, message: `${label} updated.`, data: doc });
  };

  const remove = async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw httpError(404, `${label} not found.`);

    if (beforeDelete) await beforeDelete(doc);
    await doc.deleteOne();

    res.status(200).json({ success: true, message: `${label} deleted.` });
  };

  return { create, update, remove };
};

module.exports = { buildCrudHandlers, fieldError };