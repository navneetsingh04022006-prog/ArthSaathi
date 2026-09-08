import { calculateSchemeFinancials } from '../services/financial.service.js';
import { validateFinancialRequest } from '../validators/financial.validator.js';

export async function calculateFinancialsController(request, response, next) {
  try {
    const { schemeId, loanAmount } = validateFinancialRequest(request.body);
    const data = await calculateSchemeFinancials(schemeId, loanAmount);
    response.status(200).json({
      success: true,
      data,
      message: 'Estimated financial calculation generated successfully.'
    });
  } catch (error) {
    next(error);
  }
}