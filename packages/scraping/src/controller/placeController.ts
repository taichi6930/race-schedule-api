import type { Request, Response } from 'express';

import { PlaceService } from '../service/placeService';
import { PlaceUsecase } from '../usecase/placeUsecase';

const placeService = new PlaceService();
const placeUsecase = new PlaceUsecase(placeService);

export const PlaceController = {
    // GET /api/places
    async getAllPlaces(req: Request, res: Response): Promise<void> {
        try {
            const places = await placeUsecase.getAllPlaces();
            res.json(places);
        } catch {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
