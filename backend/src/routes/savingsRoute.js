
import { Router } from 'express';
import * as savingsController from '../controllers/savingsController.js';

const router = Router();

router.get('/', savingsController.getSavings);


export default router;