import { findSchemeById, findSchemes } from '../repositories/scheme.repository.js';

export async function listSchemes(queryOptions) {
  const result = await findSchemes(queryOptions.filters, queryOptions.pagination);

  return {
    items: result.items,
    pagination: {
      page: queryOptions.pagination.page,
      limit: queryOptions.pagination.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / queryOptions.pagination.limit)
    }
  };
}

export async function getScheme(id) {
  const scheme = await findSchemeById(id);
  if (!scheme) {
    const error = new Error('Scheme was not found.');
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  return scheme;
}
