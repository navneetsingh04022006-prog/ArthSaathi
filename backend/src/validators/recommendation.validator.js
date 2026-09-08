import { validateApplicantInput } from './eligibility.validator.js';

export function validateRecommendationRequest(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createValidationError('Request body must be an object.');
  }
  const source = input.applicant || input;
  const applicant = { ...source };
  if (applicant.loanAmount !== undefined && applicant.requestedLoanAmount === undefined) {
    applicant.requestedLoanAmount = applicant.loanAmount;
  }
  delete applicant.loanAmount;
  return validateApplicantInput(applicant);
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}