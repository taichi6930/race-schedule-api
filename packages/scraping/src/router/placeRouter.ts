import { Router } from 'express';

import { PlaceController } from '../controller/placeController';

const router: Router = Router();

// GET /api/places
router.get('/places', async (req, res) =>
    PlaceController.getAllPlaces(req, res),
);

export default router;
