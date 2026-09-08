import { listSchemes, getScheme } from '../services/scheme.service.js';
import { validateSchemeListQuery } from '../validators/scheme.validator.js';

export async function listSchemesController(request, response, next) {
  try {
    const queryOptions = validateSchemeListQuery(request.query);
    const data = await listSchemes(queryOptions);
    response.status(200).json({
      success: true,
      data,
      message: 'Schemes retrieved successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getSchemeController(request, response, next) {
  try {
    const scheme = await getScheme(request.params.id);
    response.status(200).json({
      success: true,
      data: scheme,
      message: 'Scheme retrieved successfully.'
    });
  } catch (error) {
    next(error);
  }
}
