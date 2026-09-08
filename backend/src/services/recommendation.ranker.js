import { evaluateEligibility } from './eligibility.engine.js';
import { recommendationDefaults, recommendationWeights } from '../config/recommendation.js';

export function rankEligibleSchemes(schemes, applicant, weights = recommendationWeights) {
  return schemes
    .map((scheme) => createRecommendation(scheme, applicant, weights))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.scheme.schemeId.localeCompare(right.scheme.schemeId));
}

export function createRecommendation(scheme, applicant, weights = recommendationWeights) {
  const eligibility = evaluateEligibility(scheme, applicant);
  if (!eligibility.eligible) return null;

  const factors = {
    purposeFit: scorePurposeFit(scheme, applicant),
    financialFit: scoreFinancialFit(scheme, applicant),
    loanAmountFit: scoreLoanAmountFit(scheme, applicant),
    locationFit: scoreLocationFit(scheme, applicant)
  };
  const score = calculateWeightedScore(factors, weights);

  return {
    scheme: toPublicScheme(scheme),
    score,
    reasons: buildReasons(scheme, applicant, eligibility, factors),
    eligibility: {
      eligible: eligibility.eligible,
      reasons: eligibility.reasons,
      failedRules: eligibility.failedRules,
      missingRequirements: eligibility.missingRequirements
    },
    scoreBreakdown: factors
  };
}

export function calculateWeightedScore(factors, weights) {
  const activeFactors = Object.entries(weights)
    .filter(([factor, weight]) => Number.isFinite(weight) && weight > 0 && factors[factor] !== undefined);
  const totalWeight = activeFactors.reduce((total, [, weight]) => total + weight, 0);
  if (!totalWeight) return 0;

  const weightedScore = activeFactors.reduce((total, [factor, weight]) => total + factors[factor] * weight, 0);
  return Math.round(Math.min(100, Math.max(0, weightedScore / totalWeight)));
}

function scorePurposeFit(scheme, applicant) {
  if (!applicant.purpose) return recommendationDefaults.neutralFactorScore;
  const purposes = scheme.eligiblePurposes?.length
    ? scheme.eligiblePurposes
    : scheme.eligibilityRules?.allowedPurposes;
  if (!purposes?.length) return recommendationDefaults.neutralFactorScore;
  return purposes.some((purpose) => normalize(purpose) === normalize(applicant.purpose)) ? 100 : 0;
}

function scoreFinancialFit(scheme, applicant) {
  const amount = applicant.requestedLoanAmount;
  const rules = scheme.financialRules || {};
  if (amount === undefined || rules.minimumLoanAmount === undefined || rules.maximumLoanAmount === undefined) {
    return recommendationDefaults.neutralFactorScore;
  }
  const range = rules.maximumLoanAmount - rules.minimumLoanAmount;
  if (range <= 0) return 100;
  const midpoint = rules.minimumLoanAmount + range / 2;
  const distance = Math.abs(amount - midpoint) / (range / 2);
  return Math.round(Math.max(0, 100 - (distance * 50)));
}

function scoreLoanAmountFit(scheme, applicant) {
  const amount = applicant.requestedLoanAmount;
  const projectCost = applicant.projectCost;
  if (amount === undefined || projectCost === undefined || projectCost === 0) {
    return recommendationDefaults.neutralFactorScore;
  }
  if (amount > projectCost) return 0;
  return Math.round((amount / projectCost) * 100);
}

function scoreLocationFit(scheme, applicant) {
  const state = applicant.state;
  const district = applicant.district;
  const states = scheme.applicableStates || scheme.eligibilityRules?.allowedStates;
  const districts = scheme.eligibilityRules?.allowedDistricts;
  if (!state && !district) return recommendationDefaults.neutralFactorScore;
  if (!states?.length && !districts?.length) return recommendationDefaults.neutralFactorScore;
  if (district && districts?.length) {
    return districts.some((item) => normalize(item) === normalize(district)) ? 100 : 0;
  }
  if (state && states?.length) {
    return states.some((item) => normalize(item) === normalize(state)) ? 100 : 0;
  }
  return recommendationDefaults.neutralFactorScore;
}

function buildReasons(scheme, applicant, eligibility, factors) {
  const reasons = [...eligibility.reasons];
  if (factors.purposeFit === 100) reasons.push('Matches your requested purpose.');
  else if (factors.purposeFit === recommendationDefaults.neutralFactorScore) reasons.push('Purpose fit could not be scored from the available scheme data.');
  if (applicant.requestedLoanAmount !== undefined && scheme.financialRules?.maximumLoanAmount !== undefined) {
    reasons.push('Requested amount fits within the scheme\'s configured financing range.');
  } else {
    reasons.push('Financial fit was scored using the available scheme configuration.');
  }
  if (applicant.projectCost === undefined) reasons.push('Loan-to-project fit was not scored because project cost was not provided.');
  if (factors.locationFit === recommendationDefaults.neutralFactorScore) reasons.push('Location fit was not scored because applicable location data was unavailable.');
  else if (factors.locationFit === 100) reasons.push('The scheme is applicable to your selected location.');
  reasons.push('This Scheme Match Score is not an approval probability.');
  return reasons;
}

function toPublicScheme(scheme) {
  return {
    schemeId: scheme.schemeId,
    name: scheme.name,
    description: scheme.description,
    category: scheme.category,
    benefits: scheme.benefits || [],
    financialRules: scheme.financialRules || {},
    requiredDocuments: scheme.requiredDocuments || [],
    applicationProcess: scheme.applicationProcess || {},
    officialWebsite: scheme.officialWebsite,
    applicationUrl: scheme.applicationUrl,
    source: scheme.source
  };
}

function normalize(value) {
  return String(value).trim().toUpperCase();
}