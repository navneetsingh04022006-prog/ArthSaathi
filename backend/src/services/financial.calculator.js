const MONEY_DECIMAL_PLACES = 2;

export function calculateFinancials(scheme, loanAmount) {
  const financialRules = scheme.financialRules || {};
  validateSchemeFinancialRules(financialRules);
  validateLoanAmount(loanAmount, financialRules);

  const interestRate = financialRules.interestRate;
  const tenureMonths = financialRules.tenureMonths;
  const emi = calculateEmi(loanAmount, interestRate, tenureMonths);
  const totalRepayment = roundMoney(emi * tenureMonths);

  return {
    schemeId: scheme.schemeId,
    loanAmount: valueWithSource(loanAmount, 'USER'),
    interestRate: valueWithSource(interestRate, 'SCHEME'),
    tenureMonths: valueWithSource(tenureMonths, 'SCHEME'),
    emi: valueWithSource(emi, 'CALCULATED', true),
    totalPrincipal: valueWithSource(roundMoney(loanAmount), 'CALCULATED', true),
    totalRepayment: valueWithSource(totalRepayment, 'CALCULATED', true),
    totalInterest: valueWithSource(roundMoney(totalRepayment - loanAmount), 'CALCULATED', true),
    moratorium: valueWithSource(financialRules.moratoriumMonths ?? null, 'SCHEME'),
    moratoriumNote: financialRules.moratoriumMonths === undefined
      ? 'Moratorium information is unavailable for this scheme.'
      : 'Detailed moratorium interest treatment depends on the applicable scheme and lender terms.',
    estimate: true,
    source: scheme.source
  };
}

export function calculateEmi(principal, annualInterestRate, tenureMonths) {
  const monthlyRate = annualInterestRate / 12 / 100;
  if (monthlyRate === 0) return roundMoney(principal / tenureMonths);

  const factor = (1 + monthlyRate) ** tenureMonths;
  return roundMoney((principal * monthlyRate * factor) / (factor - 1));
}

export function validateSchemeFinancialRules(financialRules) {
  if (!isFiniteNumber(financialRules.interestRate) || financialRules.interestRate < 0) {
    throw financialError('The selected scheme does not contain a valid interest rate.');
  }
  if (!isPositiveFiniteNumber(financialRules.tenureMonths)) {
    throw financialError('The selected scheme does not contain a valid tenure.');
  }
  if (financialRules.minimumLoanAmount !== undefined && !isNonNegativeFiniteNumber(financialRules.minimumLoanAmount)) {
    throw financialError('The selected scheme does not contain a valid minimum loan amount.');
  }
  if (financialRules.maximumLoanAmount !== undefined && !isNonNegativeFiniteNumber(financialRules.maximumLoanAmount)) {
    throw financialError('The selected scheme does not contain a valid maximum loan amount.');
  }
  if (financialRules.moratoriumMonths !== undefined && !isNonNegativeFiniteNumber(financialRules.moratoriumMonths)) {
    throw financialError('The selected scheme does not contain a valid moratorium duration.');
  }
  if (financialRules.minimumLoanAmount !== undefined
    && financialRules.maximumLoanAmount !== undefined
    && financialRules.minimumLoanAmount > financialRules.maximumLoanAmount) {
    throw financialError('The selected scheme has inconsistent loan amount limits.');
  }
}

export function validateLoanAmount(loanAmount, financialRules) {
  if (!isPositiveFiniteNumber(loanAmount)) {
    throw createBusinessError('Requested loan amount must be a positive finite number.');
  }
  if (financialRules.minimumLoanAmount !== undefined && loanAmount < financialRules.minimumLoanAmount) {
    throw createBusinessError('Requested loan amount is below the configured minimum financing limit.');
  }
  if (financialRules.maximumLoanAmount !== undefined && loanAmount > financialRules.maximumLoanAmount) {
    throw createBusinessError('Requested loan amount exceeds the configured maximum financing limit.');
  }
}

export function roundMoney(value) {
  return Number(Number(value).toFixed(MONEY_DECIMAL_PLACES));
}

function valueWithSource(value, source, rounded = false) {
  return { value: rounded ? roundMoney(value) : value, source };
}

function isFiniteNumber(value) {
  return value !== '' && Number.isFinite(Number(value));
}

function isPositiveFiniteNumber(value) {
  return isFiniteNumber(value) && Number(value) > 0;
}

function isNonNegativeFiniteNumber(value) {
  return isFiniteNumber(value) && Number(value) >= 0;
}

function financialError(message) {
  return createBusinessError(message, 'FINANCIAL_CONFIGURATION_ERROR');
}

function createBusinessError(message, code = 'FINANCIAL_VALIDATION_ERROR') {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = code;
  return error;
}