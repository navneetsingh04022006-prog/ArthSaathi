import { findSchemeById } from '../repositories/scheme.repository.js';
import { evaluateEligibility } from './eligibility.engine.js';

export async function evaluateSchemeEligibility(schemeId, applicant) {
  const scheme = await findSchemeById(schemeId);
  if (!scheme) {
    const error = new Error('Scheme was not found.');
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  return evaluateEligibility(scheme, applicant);
}