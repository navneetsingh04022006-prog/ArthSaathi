import { Router } from 'express';
import { getSchemeController, listSchemesController } from '../controllers/scheme.controller.js';

const schemeRouter = Router();

schemeRouter.get('/', listSchemesController);
schemeRouter.get('/:id', getSchemeController);

export default schemeRouter;
