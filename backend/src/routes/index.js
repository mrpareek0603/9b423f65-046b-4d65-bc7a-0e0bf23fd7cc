import { Router } from 'express';
import savingsRoute from './savingsRoute.js';

const router = Router();

router.use('/savings', savingsRoute);

export default router;