import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import { evaluateEligibility } from '../src/services/eligibility.engine.js';
import { validateEligibilityRequest } from '../src/validators/eligibility.validator.js';

const scheme = {
  schemeId: 'DEMO-ELIGIBILITY-001',
  eligibilityRules: {
    minimumAge: 18,
    maximumAge: 60,
    minimumIncome: 100000,
    maximumIncome: 500000,
    allowedPurposes: ['BUSINESS'],
    beneficiaryCategories: ['WOMEN'],
    educationRequirements: ['REQUIRED']
  },
  financialRules: { minimumLoanAmount: 10000, maximumLoanAmount: 140000 }
};

const eligibleApplicant = {
  income: 300000,
  age: 28,
  purpose: 'business',
  requestedLoanAmount: 120000,
  educationStatus: true,
  beneficiaryCategory: 'women'
};

test('eligibility engine passes all configured rules', () => {
  const result = evaluateEligibility(scheme, eligibleApplicant);

  assert.equal(result.eligible, true);
  assert.deepEqual(result.failedRules, []);
  assert.deepEqual(result.missingRequirements, []);
  assert.equal(result.reasons.length, 6);
});

test('income boundaries are inclusive and out-of-range income fails', () => {
  assert.equal(evaluateEligibility(scheme, { ...eligibleApplicant, income: 100000 }).eligible, true);
  assert.equal(evaluateEligibility(scheme, { ...eligibleApplicant, income: 500000 }).eligible, true);
  const result = evaluateEligibility(scheme, { ...eligibleApplicant, income: 500001 });

  assert.equal(result.eligible, false);
  assert.deepEqual(result.failedRules, ['income']);
});

test('purpose and loan boundaries are enforced from scheme configuration', () => {
  assert.equal(evaluateEligibility(scheme, { ...eligibleApplicant, purpose: 'BUSINESS', requestedLoanAmount: 10000 }).eligible, true);
  assert.equal(evaluateEligibility(scheme, { ...eligibleApplicant, requestedLoanAmount: 140000 }).eligible, true);
  const result = evaluateEligibility(scheme, { ...eligibleApplicant, purpose: 'EDUCATION', requestedLoanAmount: 140001 });

  assert.equal(result.eligible, false);
  assert.deepEqual(result.failedRules.sort(), ['purpose', 'requestedLoanAmount'].sort());
});

test('missing configured applicant fields are distinct from failed rules', () => {
  const result = evaluateEligibility(scheme, { income: 300000 });

  assert.equal(result.eligible, false);
  assert.deepEqual(result.failedRules, []);
  assert.deepEqual(result.missingRequirements, [
    'age', 'purpose', 'requestedLoanAmount', 'educationStatus', 'beneficiaryCategory'
  ]);
});

test('age, education, and beneficiary mismatches are reported independently', () => {
  const result = evaluateEligibility(scheme, {
    ...eligibleApplicant,
    age: 17,
    educationStatus: false,
    beneficiaryCategory: 'OTHER'
  });

  assert.equal(result.eligible, false);
  assert.deepEqual(result.failedRules.sort(), ['age', 'educationStatus', 'beneficiaryCategory'].sort());
});

test('schemes without optional rules do not require optional applicant fields', () => {
  const result = evaluateEligibility({ schemeId: 'OPTIONAL-001', eligibilityRules: {}, financialRules: {} }, {});

  assert.equal(result.eligible, true);
  assert.deepEqual(result.reasons, []);
});

test('eligibility evaluation is deterministic for the same inputs', () => {
  const first = evaluateEligibility(scheme, eligibleApplicant);
  const second = evaluateEligibility(scheme, eligibleApplicant);

  assert.deepEqual(first, second);
});

test('eligibility validator rejects malformed and negative input', () => {
  assert.throws(() => validateEligibilityRequest({ schemeId: 'bad', applicant: {} }), /valid scheme identifier/);
  assert.throws(() => validateEligibilityRequest({
    schemeId: '507f1f77bcf86cd799439011',
    applicant: { income: -1 }
  }), /income must be a non-negative number/);
  assert.throws(() => validateEligibilityRequest({
    schemeId: '507f1f77bcf86cd799439011',
    applicant: { educationStatus: 'yes' }
  }), /educationStatus must be a boolean/);
});

test('eligibility API rejects invalid input using centralized response format', async () => {
  const response = await request(app)
    .post('/api/v1/eligibility/evaluate')
    .send({ schemeId: 'bad', applicant: {} });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});