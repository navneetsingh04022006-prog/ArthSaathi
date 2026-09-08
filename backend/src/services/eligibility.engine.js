export function evaluateEligibility(scheme, applicant) {
  const rules = scheme.eligibilityRules || {};
  const financialRules = scheme.financialRules || {};
  const evaluations = [
    evaluateRange('income', applicant.income, rules.minimumIncome, rules.maximumIncome, 'Income falls within the eligible range.'),
    evaluateRange('age', applicant.age, rules.minimumAge, rules.maximumAge, 'Age falls within the eligible range.'),
    evaluateList('purpose', applicant.purpose, rules.allowedPurposes, 'Requested purpose is supported.'),
    evaluateRange('requestedLoanAmount', applicant.requestedLoanAmount, financialRules.minimumLoanAmount, financialRules.maximumLoanAmount, 'Requested loan amount is within the configured limits.'),
    evaluateEducation(applicant.educationStatus, rules.educationRequirements),
    evaluateList('beneficiaryCategory', applicant.beneficiaryCategory, rules.beneficiaryCategories, 'Beneficiary category is supported.'),
    evaluateList('gender', applicant.gender, rules.allowedGenders, 'Applicant gender is supported.'),
    evaluateRegistration(applicant, rules.registrationRequirements),
    evaluateList('state', applicant.state, rules.allowedStates, 'Applicant state is supported.'),
    evaluateList('district', applicant.district, rules.allowedDistricts, 'Applicant district is supported.')
  ].filter(Boolean);

  const missingRequirements = evaluations.filter((item) => item.missing).map((item) => item.rule);
  const failedRules = evaluations.filter((item) => !item.passed && !item.missing).map((item) => item.rule);
  const reasons = evaluations.filter((item) => item.passed).map((item) => item.reason);
  const failedReasons = evaluations.filter((item) => !item.passed && !item.missing).map((item) => item.reason);

  return {
    eligible: failedRules.length === 0 && missingRequirements.length === 0,
    schemeId: scheme.schemeId,
    reasons: [...reasons, ...failedReasons],
    failedRules,
    missingRequirements
  };
}

export function evaluateRange(rule, value, minimum, maximum, successReason) {
  if (minimum === undefined && maximum === undefined) return null;
  if (value === undefined) return missing(rule);
  const passed = value >= (minimum ?? Number.NEGATIVE_INFINITY)
    && value <= (maximum ?? Number.POSITIVE_INFINITY);
  return result(rule, passed, passed ? successReason : `${rule} does not satisfy the configured range.`);
}

export function evaluateList(rule, value, allowedValues, successReason) {
  if (!allowedValues?.length) return null;
  if (value === undefined) return missing(rule);
  const passed = allowedValues.some((allowedValue) => normalize(allowedValue) === normalize(value));
  return result(rule, passed, passed ? successReason : `${rule} is not supported by this scheme.`);
}

export function evaluateEducation(value, requirements) {
  if (!requirements?.length) return null;
  if (value === undefined) return missing('educationStatus');
  const requiresEducation = requirements.some((requirement) => !['NONE', 'NOT_REQUIRED', 'FALSE', 'NO'].includes(normalize(requirement)));
  const passed = requiresEducation ? value === true : value === false;
  return result('educationStatus', passed, passed ? 'Education requirement is satisfied.' : 'Education requirement is not satisfied.');
}

function evaluateRegistration(applicant, requirements) {
  if (!requirements?.length) return null;
  const value = applicant.registrationStatus ?? applicant.registrationType;
  return evaluateList('registrationStatus', value, requirements, 'Registration requirement is satisfied.');
}

function result(rule, passed, reason) {
  return { rule, passed, reason, missing: false };
}

function missing(rule) {
  return { rule, passed: false, reason: `${rule} is required to evaluate this scheme.`, missing: true };
}

function normalize(value) {
  return String(value).trim().toUpperCase();
}