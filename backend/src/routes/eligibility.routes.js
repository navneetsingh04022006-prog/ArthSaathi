import { Router } from 'express';
import { evaluateEligibilityController } from '../controllers/eligibility.controller.js';

const eligibilityRouter = Router();

eligibilityRouter.post('/evaluate', evaluateEligibilityController);

export default eligibilityRouter;