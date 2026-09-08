import { recommendSchemes } from '../services/recommendation.service.js';
import { validateRecommendationRequest } from '../validators/recommendation.validator.js';

export async function recommendSchemesController(request, response, next) {
  try {
    const applicant = validateRecommendationRequest(request.body);
    const data = await recommendSchemes(applicant);
    response.status(200).json({
      success: true,
      data,
      message: data.message || 'Scheme recommendations generated successfully.'
    });
  } catch (error) {
    next(error);
  }
}