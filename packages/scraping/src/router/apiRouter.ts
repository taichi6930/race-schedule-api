import type { Router } from 'express';
import express from 'express';

import placeRouter from './placeRouter';

const router: Router = express.Router();

router.use('/api', placeRouter);

export default router;
