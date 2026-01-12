import express from 'express';

import placeRouter from './placeRouter';

const router = express.Router();

router.use('/api', placeRouter);

export default router;
