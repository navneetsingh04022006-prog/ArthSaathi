import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import { calculateWeightedScore, rankEligibleSchemes } from '../src/services/recommendation.ranker.js';
import { recommendSchemesFromData } from '../src/services/recommendation.service.js';
import { validateRecommendationRequest } from '../src/validators/recommendation.validator.js';

const applicant = {
  income: 300000,
  age: 28,
  purpose: 'BUSINESS',
  projectCost: 200000,
  requestedLoanAmount: 120000,
  state: 'DEMO_STATE'
};

const eligibleScheme = {
  schemeId: 'SCHEME-A',
  name: 'Purpose Fit Scheme',
  description: 'A generic test scheme.',
  category: 'BUSINESS',
  eligiblePurposes: ['BUSINESS'],
  applicableStates: ['DEMO_STATE'],
  eligibilityRules: {
    minimumAge: 18,
    maximumIncome: 500000,
    allowedPurposes: ['BUSINESS'],
    allowedStates: ['DEMO_STATE']
  },
  financialRules: {
    minimumLoanAmount: 10000,
    maximumLoanAmount: 140000,
    interestRate: 6.5
  },
  source: { sourceType: 'DEMO', authority: 'Test configuration' }
};

const lowerFitScheme = {
  ...eligibleScheme,
  schemeId: 'SCHEME-B',
  name: 'Lower Fit Scheme',
  eligiblePurposes: ['OTHER'],
  eligibilityRules: {
    ...eligibleScheme.eligibilityRules,
    allowedPurposes: []
  },
  financialRules: {
    ...eligibleScheme.financialRules,
    minimumLoanAmount: 100000,
    maximumLoanAmount: 500000
  },
  applicableStates: ['OTHER_STATE'],
  source: { sourceType: 'DEMO', authority: 'Test configuration' }
};

const ineligibleScheme = {
  ...eligibleScheme,
  schemeId: 'SCHEME-INELIGIBLE',
  eligibilityRules: {
    ...eligibleScheme.eligibilityRules,
    maximumIncome: 200000
  }
};

test('recommendation ranking filters ineligible schemes and ranks higher fit first', () => {
  const recommendations = rankEligibleSchemes([lowerFitScheme, ineligibleScheme, eligibleScheme], applicant);

  assert.deepEqual(recommendations.map((item) => item.scheme.schemeId), ['SCHEME-A', 'SCHEME-B']);
  assert.ok(recommendations[0].score > recommendations[1].score);
  assert.equal(recommendations.some((item) => item.scheme.schemeId === 'SCHEME-INELIGIBLE'), false);
});

test('recommendation score is bounded and deterministic', () => {
  const first = rankEligibleSchemes([eligibleScheme], applicant)[0];
  const second = rankEligibleSchemes([eligibleScheme], applicant)[0];

  assert.equal(first.score >= 0 && first.score <= 100, true);
  assert.deepEqual(first, second);
});

test('configurable weights change ranking factors without changing eligibility', () => {
  const factors = { purposeFit: 100, financialFit: 20, loanAmountFit: 20, locationFit: 0 };

  assert.equal(calculateWeightedScore(factors, { purposeFit: 1, financialFit: 0, loanAmountFit: 0, locationFit: 0 }), 100);
  assert.equal(calculateWeightedScore(factors, { purposeFit: 0, financialFit: 1, loanAmountFit: 0, locationFit: 0 }), 20);
});

test('missing optional location and project cost data are neutral and explained', () => {
  const applicantWithoutOptionalData = { ...applicant };
  delete applicantWithoutOptionalData.projectCost;
  delete applicantWithoutOptionalData.state;
  const schemeWithoutLocationRule = {
    ...eligibleScheme,
    eligibilityRules: { ...eligibleScheme.eligibilityRules, allowedStates: [] }
  };
  const recommendation = rankEligibleSchemes([schemeWithoutLocationRule], applicantWithoutOptionalData)[0];

  assert.equal(recommendation.scoreBreakdown.locationFit, 50);
  assert.equal(recommendation.scoreBreakdown.loanAmountFit, 50);
  assert.ok(recommendation.reasons.some((reason) => reason.includes('Location fit was not scored')));
  assert.ok(recommendation.reasons.some((reason) => reason.includes('project cost was not provided')));
});

test('recommendations expose source and financial metadata without internal fields', () => {
  const recommendation = rankEligibleSchemes([eligibleScheme], applicant)[0];

  assert.equal(recommendation.scheme.source.sourceType, 'DEMO');
  assert.equal(recommendation.scheme.financialRules.maximumLoanAmount, 140000);
  assert.equal(recommendation.scheme._id, undefined);
  assert.ok(recommendation.reasons.includes('This Scheme Match Score is not an approval probability.'));
});

test('empty and no-match cases return structured non-error results', () => {
  const empty = recommendSchemesFromData([], applicant);
  const noMatch = recommendSchemesFromData([ineligibleScheme], applicant);

  assert.deepEqual(empty.recommendations, []);
  assert.equal(empty.message, 'No matching eligible schemes found.');
  assert.deepEqual(noMatch.recommendations, []);
  assert.equal(noMatch.totalCandidates, 1);
});

test('recommendation validator reuses applicant validation and supports loanAmount alias', () => {
  const result = validateRecommendationRequest({
    applicant: { income: 300000, age: 28, loanAmount: 120000 }
  });

  assert.equal(result.requestedLoanAmount, 120000);
  assert.equal(result.loanAmount, undefined);
  assert.throws(() => validateRecommendationRequest({ income: -1 }), /income must be a non-negative number/);
});

test('recommendation API rejects invalid requests using centralized error handling', async () => {
  const response = await request(app)
    .post('/api/v1/recommendations')
    .send({ applicant: { income: -1 } });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});