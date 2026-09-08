import { Router } from 'express';
import { listSchemePartnersController } from '../controllers/partner.controller.js';

const schemePartnerRouter = Router();

schemePartnerRouter.get('/:schemeId/partners', listSchemePartnersController);

export default schemePartnerRouter;