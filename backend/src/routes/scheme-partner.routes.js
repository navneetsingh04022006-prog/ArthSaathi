import { Router } from 'express';
import {
	listNearbySchemePartnersController,
	listSchemePartnersController
} from '../controllers/partner.controller.js';

const schemePartnerRouter = Router();

schemePartnerRouter.get('/:schemeId/partners/nearby', listNearbySchemePartnersController);
schemePartnerRouter.get('/:schemeId/partners', listSchemePartnersController);

export default schemePartnerRouter;