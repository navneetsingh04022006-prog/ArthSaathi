import mongoose from 'mongoose';

const numericFields = ['income', 'age', 'projectCost', 'requestedLoanAmount'];

export function validateEligibilityRequest(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createValidationError('Request body must be an object.');
  }
  if (!input.schemeId || !mongoose.isValidObjectId(input.schemeId)) {
    throw createValidationError('schemeId must be a valid scheme identifier.');
  }
  if (!input.applicant || typeof input.applicant !== 'object' || Array.isArray(input.applicant)) {
    throw createValidationError('applicant must be an object.');
  }

  const applicant = validateApplicantInput(input.applicant);

  return { schemeId: input.schemeId, applicant };
}

export function validateApplicantInput(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createValidationError('applicant must be an object.');
  }

  const applicant = { ...input };
  for (const field of numericFields) {
    if (applicant[field] === undefined) continue;
    if (!Number.isFinite(Number(applicant[field])) || Number(applicant[field]) < 0) {
      throw createValidationError(`${field} must be a non-negative number.`);
    }
    applicant[field] = Number(applicant[field]);
  }

  if (applicant.age !== undefined && (!Number.isInteger(applicant.age) || applicant.age > 120)) {
    throw createValidationError('age must be an integer between 0 and 120.');
  }
  for (const field of ['purpose', 'beneficiaryCategory', 'gender', 'state', 'district']) {
    if (applicant[field] !== undefined && typeof applicant[field] !== 'string') {
      throw createValidationError(`${field} must be a string.`);
    }
  }
  if (applicant.educationStatus !== undefined && typeof applicant.educationStatus !== 'boolean') {
    throw createValidationError('educationStatus must be a boolean.');
  }

  return applicant;
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}