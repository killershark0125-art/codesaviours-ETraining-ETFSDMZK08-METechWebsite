// Reads ?page and ?limit safely and returns the numbers a query needs.
const getPagination = (query, defaultLimit = 9, maxLimit = 50) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || defaultLimit, 1),
    maxLimit
  );

  return { page, limit, skip: (page - 1) * limit };
};

// Builds the "pagination" object from the API contract.
const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { getPagination, buildPagination };