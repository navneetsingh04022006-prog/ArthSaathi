import { Router } from 'express';
import { calculateFinancialsController } from '../controllers/financial.controller.js';

const financialRouter = Router();

financialRouter.post('/emi', calculateFinancialsController);

export default financialRouter;