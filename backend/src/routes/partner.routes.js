import { Router } from 'express';
import {
  getPartnerController,
  listPartnersController
} from '../controllers/partner.controller.js';

const partnerRouter = Router();

partnerRouter.get('/', listPartnersController);
partnerRouter.get('/:partnerId', getPartnerController);

export default partnerRouter;