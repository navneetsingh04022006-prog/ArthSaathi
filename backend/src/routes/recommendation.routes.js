import { Router } from 'express';
import { recommendSchemesController } from '../controllers/recommendation.controller.js';

const recommendationRouter = Router();

recommendationRouter.post('/', recommendSchemesController);

export default recommendationRouter;