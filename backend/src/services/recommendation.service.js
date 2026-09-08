import { recommendationDefaults } from '../config/recommendation.js';
import { findSchemes } from '../repositories/scheme.repository.js';
import { rankEligibleSchemes } from './recommendation.ranker.js';

export async function recommendSchemes(applicant) {
  const result = await findSchemes(
    { status: { $in: ['ACTIVE', 'DRAFT'] } },
    { skip: 0, limit: recommendationDefaults.maximumCandidates }
  );

  return recommendSchemesFromData(result.items, applicant);
}

export function recommendSchemesFromData(schemes, applicant, weights) {
  const recommendations = rankEligibleSchemes(schemes, applicant, weights);
  return {
    recommendations,
    totalCandidates: schemes.length,
    totalEligible: recommendations.length,
    message: recommendations.length
      ? undefined
      : 'No matching eligible schemes found.'
  };
}