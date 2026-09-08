const allowedPartnerTypes = new Set([
  'BANK',
  'FINANCIAL_INSTITUTION',
  'GOVERNMENT_AGENCY',
  'DEVELOPMENT_CORPORATION',
  'DISTRICT_OFFICE',
  'SUPPORT_CENTER',
  'EDUCATIONAL_INSTITUTION',
  'ENTREPRENEURSHIP_CENTER',
  'OTHER'
]);
const allowedStatuses = new Set(['ACTIVE', 'INACTIVE']);
const allowedVerificationStatuses = new Set(['VERIFIED', 'DEMO', 'UNVERIFIED']);
const allowedServiceTypes = new Set([
  'SCHEME_APPLICATION_SUPPORT',
  'LOAN_APPLICATION_SUPPORT',
  'DOCUMENTATION_SUPPORT',
  'FINANCIAL_GUIDANCE',
  'ENTREPRENEURSHIP_SUPPORT',
  'EDUCATION_LOAN_SUPPORT',
  'BUSINESS_LOAN_SUPPORT',
  'APPLICATION_SUBMISSION',
  'GENERAL_INFORMATION'
]);

export function validatePartnerListQuery(query = {}) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 20 : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) throw validationError('page must be a positive integer.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw validationError('limit must be an integer between 1 and 100.');

  assertAllowed(query.type, allowedPartnerTypes, 'type');
  assertAllowed(query.status, allowedStatuses, 'status');
  assertAllowed(query.verificationStatus, allowedVerificationStatuses, 'verificationStatus');
  assertAllowed(query.service, allowedServiceTypes, 'service');

  return {
    filters: buildFilters(query),
    pagination: { page, limit, skip: (page - 1) * limit }
  };
}

export function validatePartnerId(partnerId) {
  if (!partnerId || !/^[A-Za-z0-9_-]+$/.test(partnerId)) {
    throw validationError('partnerId is invalid.');
  }
  return partnerId.toUpperCase();
}

export function validatePartnerInput(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw validationError('Partner data must be an object.');
  if (!input.partnerId || !/^[A-Za-z0-9_-]+$/.test(input.partnerId)) throw validationError('partnerId is invalid.');
  if (!input.name || typeof input.name !== 'string') throw validationError('name is required.');
  if (!allowedPartnerTypes.has(input.partnerType)) throw validationError('partnerType is not supported.');
  if (!allowedStatuses.has(input.status)) throw validationError('status is not supported.');
  if (!allowedVerificationStatuses.has(input.verificationStatus)) throw validationError('verificationStatus is not supported.');
  if (!input.address || typeof input.address !== 'object') throw validationError('address is required.');
  if (!input.address.state || !input.address.district) throw validationError('address state and district are required.');
  if (input.serviceTypes && (!Array.isArray(input.serviceTypes) || input.serviceTypes.some((service) => !allowedServiceTypes.has(service)))) {
    throw validationError('serviceTypes contains an unsupported service.');
  }
  validateLocation(input.location);
  validateUrl(input.contactInformation?.website, 'contactInformation.website');
  validateUrl(input.source?.sourceUrl, 'source.sourceUrl');
  return input;
}

function buildFilters(query) {
  return {
    status: query.status || 'ACTIVE',
    ...(query.type ? { partnerType: query.type } : {}),
    ...(query.verificationStatus ? { verificationStatus: query.verificationStatus } : {}),
    ...(query.state ? { 'address.state': query.state } : {}),
    ...(query.district ? { 'address.district': query.district } : {}),
    ...(query.service ? { serviceTypes: query.service } : {}),
    ...(query.schemeId ? { supportedSchemes: query.schemeId.toUpperCase() } : {})
  };
}

function assertAllowed(value, allowedValues, field) {
  if (value && !allowedValues.has(value)) throw validationError(`${field} is not supported.`);
}

function validateLocation(location) {
  if (!location) return;
  if (!Number.isFinite(Number(location.latitude)) || Number(location.latitude) < -90 || Number(location.latitude) > 90) {
    throw validationError('latitude must be between -90 and 90.');
  }
  if (!Number.isFinite(Number(location.longitude)) || Number(location.longitude) < -180 || Number(location.longitude) > 180) {
    throw validationError('longitude must be between -180 and 180.');
  }
}

function validateUrl(value, field) {
  if (value === undefined) return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    throw validationError(`${field} must be a valid HTTP or HTTPS URL.`);
  }
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}