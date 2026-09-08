import { findRelevantPartners, getPartner, listPartners } from '../services/partner.service.js';
import { validatePartnerId, validatePartnerListQuery } from '../validators/partner.validator.js';

export async function listPartnersController(request, response, next) {
  try {
    const queryOptions = validatePartnerListQuery(request.query);
    const data = await listPartners(queryOptions);
    response.status(200).json({ success: true, data, message: 'Partners retrieved successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function getPartnerController(request, response, next) {
  try {
    const partner = await getPartner(validatePartnerId(request.params.partnerId));
    response.status(200).json({ success: true, data: partner, message: 'Partner retrieved successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function listSchemePartnersController(request, response, next) {
  try {
    const schemeId = validatePartnerId(request.params.schemeId);
    const queryOptions = validatePartnerListQuery(request.query);
    const data = await findRelevantPartners(schemeId, queryOptions);
    response.status(200).json({
      success: true,
      data,
      message: data.message || 'Relevant partners retrieved successfully.'
    });
  } catch (error) {
    next(error);
  }
}