import env from '../config/env.js';
import { validateCoordinates } from '../utils/geo.js';
import { validatePartnerId, validateServiceType } from './partner.validator.js';

export function validateNearbyPartnerQuery(schemeId, query = {}) {
  const normalizedSchemeId = validatePartnerId(schemeId);
  if (query.latitude === undefined || query.longitude === undefined) {
    throw validationError('latitude and longitude are required for nearby partner routing.');
  }
  const coordinates = validateCoordinates(query.latitude, query.longitude);
  const radiusKm = query.radiusKm === undefined
    ? env.defaultPartnerSearchRadiusKm
    : Number(query.radiusKm);
  if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > env.maxPartnerSearchRadiusKm) {
    throw validationError(`radiusKm must be greater than 0 and no more than ${env.maxPartnerSearchRadiusKm}.`);
  }
  const limit = query.limit === undefined ? env.defaultPartnerResultLimit : Number(query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > env.maxPartnerResultLimit) {
    throw validationError(`limit must be an integer between 1 and ${env.maxPartnerResultLimit}.`);
  }
  if (query.service && typeof query.service !== 'string') {
    throw validationError('service must be a string.');
  }
  validateServiceType(query.service);

  return {
    schemeId: normalizedSchemeId,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    radiusKm,
    limit,
    service: query.service
  };
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}