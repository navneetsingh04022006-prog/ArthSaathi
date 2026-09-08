import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import Scheme from '../src/models/Scheme.js';
import { validateSchemeListQuery } from '../src/validators/scheme.validator.js';

const validScheme = {
  schemeId: 'DEMO-TEST-001',
  name: 'Demo Test Scheme',
  description: 'A clearly labelled test configuration.',
  category: 'BUSINESS',
  targetBeneficiaries: ['DEMO_ENTREPRENEUR'],
  sectors: ['DEMO_MICRO_BUSINESS'],
  applicableStates: ['DEMO_STATE'],
  eligiblePurposes: ['DEMO_BUSINESS_START'],
  eligibilityRules: {
    minimumAge: 18,
    maximumIncome: 500000,
    allowedPurposes: ['DEMO_BUSINESS_START'],
    allowedStates: ['DEMO_STATE']
  },
  financialRules: {
    minimumLoanAmount: 10000,
    maximumLoanAmount: 140000,
    interestRate: 6.5,
    moratoriumMonths: 3,
    tenureMonths: 60
  },
  requiredDocuments: [{ name: 'Demo identity document', required: true }],
  applicationProcess: { steps: ['Review the demo configuration.'] },
  source: {
    sourceType: 'DEMO',
    authority: 'ArthSaathi test configuration'
  }
};

test('Scheme accepts structured eligibility and financial rules', () => {
  const scheme = new Scheme(validScheme);
  const validationError = scheme.validateSync();

  assert.equal(validationError, undefined);
  assert.equal(scheme.source.sourceType, 'DEMO');
  assert.equal(scheme.eligibilityRules.maximumIncome, 500000);
});

test('Scheme rejects missing required source and rule data', () => {
  const scheme = new Scheme({
    schemeId: 'DEMO-INVALID-001',
    name: 'Invalid Scheme',
    description: 'Invalid test data.',
    category: 'BUSINESS'
  });
  const validationError = scheme.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.eligibilityRules);
  assert.ok(validationError.errors.financialRules);
  assert.ok(validationError.errors.applicationProcess);
  assert.ok(validationError.errors.source);
});

test('scheme list query validation creates bounded pagination filters', () => {
  const result = validateSchemeListQuery({
    page: '2',
    limit: '10',
    category: 'BUSINESS',
    state: 'DEMO_STATE'
  });

  assert.deepEqual(result.filters, {
    category: 'BUSINESS',
    applicableStates: 'DEMO_STATE'
  });
  assert.deepEqual(result.pagination, { page: 2, limit: 10, skip: 10 });
});

test('invalid scheme list query returns a validation response', async () => {
  const response = await request(app).get('/api/v1/schemes?limit=101');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('malformed scheme identifiers return a validation response', async () => {
  const response = await request(app).get('/api/v1/schemes/not-an-object-id');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('scheme model exposes the expected collection name', () => {
  assert.equal(Scheme.collection.name, 'schemes');
  assert.equal(mongoose.models.Scheme, Scheme);
});
