import mongoose from 'mongoose';

export function validateFinancialRequest(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createValidationError('Request body must be an object.');
  }
  if (!input.schemeId || !mongoose.isValidObjectId(input.schemeId)) {
    throw createValidationError('schemeId must be a valid scheme identifier.');
  }

  const loanAmount = input.loanAmount ?? input.requestedLoanAmount;
  if (!isPositiveFiniteNumber(loanAmount)) {
    throw createValidationError('loanAmount must be a positive finite number.');
  }

  return { schemeId: input.schemeId, loanAmount: Number(loanAmount) };
}

export function createValidationError(message, code = 'VALIDATION_ERROR') {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = code;
  return error;
}

export function isPositiveFiniteNumber(value) {
  return value !== '' && Number.isFinite(Number(value)) && Number(value) > 0;
}