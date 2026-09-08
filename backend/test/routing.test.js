import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import { haversineDistanceKm, validateCoordinates } from '../src/utils/geo.js';
import { routePartnersFromData } from '../src/services/routing.service.js';
import { validateNearbyPartnerQuery } from '../src/validators/routing.validator.js';

const schemeId = 'DEMO-MICRO-BUSINESS-001';
const basePartner = {
  partnerId: 'DEMO-GEO-PARTNER-001',
  name: 'Demo Nearby Partner',
  partnerType: 'SUPPORT_CENTER',
  status: 'ACTIVE',
  verificationStatus: 'DEMO',
  address: { district: 'DEMO_DISTRICT', state: 'DEMO_STATE' },
  location: { latitude: 20, longitude: 75 },
  supportedSchemes: [schemeId],
  serviceTypes: ['SCHEME_APPLICATION_SUPPORT'],
  source: { sourceType: 'DEMO' }
};

const search = {
  schemeId,
  latitude: 20,
  longitude: 75,
  radiusKm: 10,
  limit: 20,
  service: 'SCHEME_APPLICATION_SUPPORT'
};

test('Haversine distance is zero at the same location and known-distance values are stable', () => {
  assert.equal(haversineDistanceKm({ latitude: 20, longitude: 75 }, { latitude: 20, longitude: 75 }), 0);
  assert.equal(haversineDistanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }), 111.19);
  assert.equal(haversineDistanceKm({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 0 }), 111.19);
});

test('coordinate validation rejects missing, malformed, and impossible coordinates', () => {
  assert.deepEqual(validateCoordinates('20', '75'), { latitude: 20, longitude: 75 });
  for (const values of [[91, 75], [-91, 75], [20, 181], [20, -181], [Number.NaN, 75], [20, Number.POSITIVE_INFINITY]]) {
    assert.throws(() => validateCoordinates(values[0], values[1]), /valid coordinates/);
  }
});

test('nearby query validation applies defaults and bounds radius and result count', () => {
  const result = validateNearbyPartnerQuery(schemeId, { latitude: 20, longitude: 75 });

  assert.equal(result.latitude, 20);
  assert.equal(result.longitude, 75);
  assert.equal(result.radiusKm, 10);
  assert.equal(result.limit, 20);
  assert.throws(() => validateNearbyPartnerQuery(schemeId, { latitude: 20, longitude: 75, radiusKm: 0 }), /radiusKm/);
  assert.throws(() => validateNearbyPartnerQuery(schemeId, { latitude: 20, longitude: 75, radiusKm: 101 }), /radiusKm/);
  assert.throws(() => validateNearbyPartnerQuery(schemeId, { latitude: 20, longitude: 75, service: 'INVALID' }), /service is not supported/);
  assert.throws(() => validateNearbyPartnerQuery(schemeId, { latitude: 20, longitude: 75, limit: 101 }), /limit/);
});

test('routing filters scheme, service, active status, coordinates, and radius', () => {
  const results = routePartnersFromData([
    { ...basePartner, name: 'Nearby Valid' },
    { ...basePartner, partnerId: 'OUTSIDE', name: 'Outside Radius', location: { latitude: 21, longitude: 75 } },
    { ...basePartner, partnerId: 'NO-LOCATION', name: 'No Location', location: undefined },
    { ...basePartner, partnerId: 'INACTIVE', name: 'Inactive', status: 'INACTIVE' },
    { ...basePartner, partnerId: 'WRONG-SCHEME', name: 'Wrong Scheme', supportedSchemes: ['OTHER'] },
    { ...basePartner, partnerId: 'WRONG-SERVICE', name: 'Wrong Service', serviceTypes: ['GENERAL_INFORMATION'] }
  ], search);

  assert.deepEqual(results.map((partner) => partner.name), ['Nearby Valid']);
  assert.deepEqual(results[0].distance, { value: 0, unit: 'km', method: 'geographic' });
  assert.ok(results[0].reasons.some((reason) => reason.includes('geographic distance')));
});

test('trust is ranked before distance and nearby unsupported partners are never returned', () => {
  const results = routePartnersFromData([
    { ...basePartner, name: 'Far Verified', verificationStatus: 'VERIFIED', location: { latitude: 20.05, longitude: 75 } },
    { ...basePartner, name: 'Near Demo', location: { latitude: 20.001, longitude: 75 } },
    { ...basePartner, name: 'Near Unsupported', supportedSchemes: ['OTHER'], location: { latitude: 20, longitude: 75 } }
  ], { ...search, radiusKm: 20 });

  assert.deepEqual(results.map((partner) => partner.name), ['Far Verified', 'Near Demo']);
  assert.equal(results[0].verificationStatus, 'VERIFIED');
});

test('routing result limits and empty results are deterministic', () => {
  const results = routePartnersFromData([
    { ...basePartner, name: 'A', location: { latitude: 20.001, longitude: 75 } },
    { ...basePartner, name: 'B', location: { latitude: 20.002, longitude: 75 } }
  ], { ...search, limit: 1 });
  const empty = routePartnersFromData([basePartner], {
    ...search,
    latitude: 20.01,
    radiusKm: 0.001
  });

  assert.equal(results.length, 1);
  assert.deepEqual(empty, []);
});

test('nearby routing API rejects invalid coordinates and filters', async () => {
  const invalidCoordinates = await request(app).get(`/api/v1/schemes/${schemeId}/partners/nearby?latitude=91&longitude=75`);
  const invalidService = await request(app).get(`/api/v1/schemes/${schemeId}/partners/nearby?latitude=20&longitude=75&service=INVALID`);

  assert.equal(invalidCoordinates.status, 400);
  assert.equal(invalidCoordinates.body.error.code, 'VALIDATION_ERROR');
  assert.equal(invalidService.status, 400);
  assert.equal(invalidService.body.error.code, 'VALIDATION_ERROR');
});