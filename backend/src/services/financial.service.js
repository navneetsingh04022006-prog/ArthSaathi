import { findSchemeById } from '../repositories/scheme.repository.js';
import { calculateFinancials } from './financial.calculator.js';

export async function calculateSchemeFinancials(schemeId, loanAmount) {
  const scheme = await findSchemeById(schemeId);
  if (!scheme) {
    const error = new Error('Scheme was not found.');
    error.statusCode = 404;
    error.code = 'SCHEME_NOT_FOUND';
    throw error;
  }

  return calculateFinancials(scheme, loanAmount);
}