const allowedCategories = new Set([
  'BUSINESS',
  'EDUCATION',
  'AGRICULTURE',
  'SELF_EMPLOYMENT',
  'OTHER'
]);
const allowedStatuses = new Set(['DRAFT', 'ACTIVE', 'INACTIVE']);

export function validateSchemeListQuery(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 20 : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    throw createValidationError('page must be a positive integer.');
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw createValidationError('limit must be an integer between 1 and 100.');
  }
  if (query.category && !allowedCategories.has(query.category)) {
    throw createValidationError('category is not supported.');
  }
  if (query.status && !allowedStatuses.has(query.status)) {
    throw createValidationError('status is not supported.');
  }

  return {
    filters: {
      ...(query.category ? { category: query.category } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.state ? { applicableStates: query.state } : {}),
      ...(query.sector ? { sectors: query.sector } : {})
    },
    pagination: {
      page,
      limit,
      skip: (page - 1) * limit
    }
  };
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}
