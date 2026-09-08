import { evaluateSchemeEligibility } from '../services/eligibility.service.js';
import { validateEligibilityRequest } from '../validators/eligibility.validator.js';

export async function evaluateEligibilityController(request, response, next) {
  try {
    const { schemeId, applicant } = validateEligibilityRequest(request.body);
    const data = await evaluateSchemeEligibility(schemeId, applicant);
    response.status(200).json({
      success: true,
      data,
      message: 'Scheme eligibility evaluated successfully.'
    });
  } catch (error) {
    next(error);
  }
}