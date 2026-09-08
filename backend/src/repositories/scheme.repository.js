import Scheme from '../models/Scheme.js';
import mongoose from 'mongoose';

export async function findSchemes(filters, pagination) {
  const query = Scheme.find(filters)
    .sort({ name: 1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [items, total] = await Promise.all([
    query,
    Scheme.countDocuments(filters)
  ]);

  return { items, total };
}

export function findSchemeById(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('The requested scheme identifier is invalid.');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return Scheme.findById(id).lean();
}
