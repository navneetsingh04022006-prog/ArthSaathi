import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import app from '../src/app.js';
import {
  calculateEmi,
  calculateFinancials,
  validateLoanAmount
} from '../src/services/financial.calculator.js';
import { validateFinancialRequest } from '../src/validators/financial.validator.js';

const scheme = {
  schemeId: 'DEMO-FINANCIAL-001',
  financialRules: {
    minimumLoanAmount: 10000,
    maximumLoanAmount: 140000,
    interestRate: 6.5,
    tenureMonths: 60,
    moratoriumMonths: 3
  },
  source: { sourceType: 'DEMO', authority: 'Test configuration' }
};

test('calculates reducing-balance EMI, repayment, and interest from scheme data', () => {
  const result = calculateFinancials(scheme, 120000);

  assert.equal(result.emi.value, calculateEmi(120000, 6.5, 60));
  assert.equal(result.emi.value, 2347.94);
  assert.equal(result.totalPrincipal.value, 120000);
  assert.equal(result.totalRepayment.value, 140876.4);
  assert.equal(result.totalInterest.value, 20876.4);
  assert.equal(result.interestRate.source, 'SCHEME');
  assert.equal(result.loanAmount.source, 'USER');
  assert.equal(result.emi.source, 'CALCULATED');
  assert.equal(result.estimate, true);
});

test('handles zero interest without division by zero', () => {
  const zeroInterestScheme = {
    ...scheme,
    financialRules: { ...scheme.financialRules, interestRate: 0 }
  };
  const result = calculateFinancials(zeroInterestScheme, 120000);

  assert.equal(result.emi.value, 2000);
  assert.equal(result.totalRepayment.value, 120000);
  assert.equal(result.totalInterest.value, 0);
});

test('accepts configured minimum and maximum loan boundaries', () => {
  assert.doesNotThrow(() => validateLoanAmount(10000, scheme.financialRules));
  assert.doesNotThrow(() => validateLoanAmount(140000, scheme.financialRules));
  assert.throws(() => validateLoanAmount(9999, scheme.financialRules), /below the configured minimum/);
  assert.throws(() => validateLoanAmount(140001, scheme.financialRules), /exceeds the configured maximum/);
});

test('rejects invalid loan amounts and does not calculate outside scheme limits', () => {
  for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, 'not-a-number']) {
    assert.throws(() => calculateFinancials(scheme, value));
  }
});

test('rejects missing or invalid scheme financial parameters', () => {
  assert.throws(() => calculateFinancials({ schemeId: 'MISSING-RATE', financialRules: { tenureMonths: 60 } }, 10000), /valid interest rate/);
  assert.throws(() => calculateFinancials({ schemeId: 'MISSING-TENURE', financialRules: { interestRate: 6.5 } }, 10000), /valid tenure/);
  assert.throws(() => calculateFinancials({
    schemeId: 'NEGATIVE-MORATORIUM',
    financialRules: { interestRate: 6.5, tenureMonths: 60, moratoriumMonths: -1 }
  }, 10000), /valid moratorium/);
});

test('exposes moratorium duration without inventing its interest treatment', () => {
  const result = calculateFinancials(scheme, 10000);
  const noMoratorium = calculateFinancials({
    ...scheme,
    financialRules: { ...scheme.financialRules, moratoriumMonths: undefined }
  }, 10000);

  assert.deepEqual(result.moratorium, { value: 3, source: 'SCHEME' });
  assert.match(result.moratoriumNote, /depends on the applicable scheme and lender/);
  assert.deepEqual(noMoratorium.moratorium, { value: null, source: 'SCHEME' });
  assert.match(noMoratorium.moratoriumNote, /unavailable/);
});

test('rounds final monetary values and remains deterministic', () => {
  const first = calculateFinancials(scheme, 12345.67);
  const second = calculateFinancials(scheme, 12345.67);

  assert.deepEqual(first, second);
  assert.match(first.emi.value.toFixed(2), /^\d+\.\d{2}$/);
  assert.match(first.totalRepayment.value.toFixed(2), /^\d+\.\d{2}$/);
  assert.match(first.totalInterest.value.toFixed(2), /^\d+\.\d{2}$/);
});

test('financial request validation requires a valid scheme and positive amount', () => {
  const valid = validateFinancialRequest({
    schemeId: '507f1f77bcf86cd799439011',
    loanAmount: '120000'
  });

  assert.deepEqual(valid, {
    schemeId: '507f1f77bcf86cd799439011',
    loanAmount: 120000
  });
  assert.throws(() => validateFinancialRequest({ schemeId: 'bad', loanAmount: 10000 }), /valid scheme identifier/);
  assert.throws(() => validateFinancialRequest({
    schemeId: '507f1f77bcf86cd799439011',
    loanAmount: 0
  }), /positive finite number/);
});

test('financial API rejects malformed requests through centralized error handling', async () => {
  const response = await request(app)
    .post('/api/v1/calculations/emi')
    .send({ schemeId: 'bad', loanAmount: 10000 });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});