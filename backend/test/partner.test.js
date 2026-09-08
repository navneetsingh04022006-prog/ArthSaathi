import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import Partner from '../src/models/Partner.js';
import { discoverPartnersFromData } from '../src/services/partner.service.js';
import {
  validatePartnerId,
  validatePartnerInput,
  validatePartnerListQuery
} from '../src/validators/partner.validator.js';

const validPartner = {
  partnerId: 'DEMO-PARTNER-001',
  name: 'Demo Support Center',
  partnerType: 'SUPPORT_CENTER',
  description: 'Demo partner configuration.',
  status: 'ACTIVE',
  verificationStatus: 'DEMO',
  address: {
    addressLine: 'Demo Road',
    city: 'Demo City',
    district: 'DEMO_DISTRICT',
    state: 'DEMO_STATE',
    postalCode: '000000',
    country: 'India'
  },
  location: { latitude: 20, longitude: 75 },
  supportedSchemes: ['DEMO-MICRO-BUSINESS-001'],
  supportedCategories: ['BUSINESS'],
  supportedPurposes: ['DEMO_BUSINESS_START'],
  serviceTypes: ['SCHEME_APPLICATION_SUPPORT'],
  source: { sourceType: 'DEMO' }
};

test('Partner model accepts structured demo data and exposes its collection', () => {
  const partner = new Partner(validPartner);

  assert.equal(partner.validateSync(), undefined);
  assert.equal(partner.source.sourceType, 'DEMO');
  assert.equal(Partner.collection.name, 'partners');
});

test('Partner model rejects unsupported controlled values and invalid coordinates', () => {
  const partner = new Partner({
    ...validPartner,
    partnerType: 'UNSUPPORTED',
    location: { latitude: 91, longitude: 181 }
  });
  const validationError = partner.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.partnerType);
  assert.ok(validationError.errors['location.latitude']);
  assert.ok(validationError.errors['location.longitude']);
});

test('partner validator rejects invalid values and URLs', () => {
  assert.deepEqual(validatePartnerId('demo-partner-001'), 'DEMO-PARTNER-001');
  assert.throws(() => validatePartnerId('bad id'), /partnerId is invalid/);
  assert.throws(() => validatePartnerInput({ ...validPartner, status: 'PAUSED' }), /status is not supported/);
  assert.throws(() => validatePartnerInput({
    ...validPartner,
    contactInformation: { website: 'javascript:alert(1)' }
  }), /valid HTTP or HTTPS URL/);
  assert.throws(() => validatePartnerInput({
    ...validPartner,
    serviceTypes: ['UNSUPPORTED_SERVICE']
  }), /unsupported service/);
});

test('partner list validation creates deterministic filters', () => {
  const result = validatePartnerListQuery({
    type: 'SUPPORT_CENTER',
    service: 'SCHEME_APPLICATION_SUPPORT',
    state: 'DEMO_STATE',
    district: 'DEMO_DISTRICT',
    verificationStatus: 'DEMO'
  });

  assert.deepEqual(result.filters, {
    status: 'ACTIVE',
    partnerType: 'SUPPORT_CENTER',
    verificationStatus: 'DEMO',
    'address.state': 'DEMO_STATE',
    'address.district': 'DEMO_DISTRICT',
    serviceTypes: 'SCHEME_APPLICATION_SUPPORT'
  });
});

test('partner discovery filters scheme, status, service, and location without distance logic', () => {
  const results = discoverPartnersFromData([
    { ...validPartner, name: 'Inactive', status: 'INACTIVE' },
    { ...validPartner, name: 'Wrong Scheme', supportedSchemes: ['OTHER-SCHEME'] },
    { ...validPartner, name: 'Wrong Service', serviceTypes: ['GENERAL_INFORMATION'] },
    { ...validPartner, name: 'Wrong District', address: { ...validPartner.address, district: 'OTHER_DISTRICT' } },
    { ...validPartner, name: 'Matching Demo' },
    { ...validPartner, name: 'Matching Verified', verificationStatus: 'VERIFIED' }
  ], 'DEMO-MICRO-BUSINESS-001', {
    serviceTypes: 'SCHEME_APPLICATION_SUPPORT',
    'address.state': 'DEMO_STATE',
    'address.district': 'DEMO_DISTRICT'
  });

  assert.deepEqual(results.map((partner) => partner.name), ['Matching Verified', 'Matching Demo']);
  assert.ok(results[0].reasons.includes('Partner information is marked as verified.'));
  assert.ok(results[1].reasons.some((reason) => reason.includes('demo data')));
});

test('one partner can support multiple schemes and no-match returns an empty list', () => {
  const multiSchemePartner = { ...validPartner, supportedSchemes: ['SCHEME-A', 'SCHEME-B'] };

  assert.equal(discoverPartnersFromData([multiSchemePartner], 'SCHEME-A').length, 1);
  assert.equal(discoverPartnersFromData([multiSchemePartner], 'SCHEME-B').length, 1);
  assert.deepEqual(discoverPartnersFromData([multiSchemePartner], 'SCHEME-C'), []);
});

test('partner APIs reject invalid filters and identifiers through centralized errors', async () => {
  const invalidFilter = await request(app).get('/api/v1/partners?service=INVALID');
  const invalidId = await request(app).get('/api/v1/partners/bad%20id');
  const invalidScheme = await request(app).get('/api/v1/schemes/bad%20id/partners');

  assert.equal(invalidFilter.status, 400);
  assert.equal(invalidFilter.body.error.code, 'VALIDATION_ERROR');
  assert.equal(invalidId.status, 400);
  assert.equal(invalidId.body.error.code, 'VALIDATION_ERROR');
  assert.equal(invalidScheme.status, 400);
  assert.equal(invalidScheme.body.error.code, 'VALIDATION_ERROR');
});