import './di';

import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { RaceController } from './controller/raceController';

export const router = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/scraping/place') {
        const placeController = container.resolve(PlaceController);
        return placeController.get(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/scraping/race') {
        const raceController = container.resolve(RaceController);
        return raceController.get(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/scraping', {
            status: 200,
        });
    }
    return new Response('Not Found', { status: 404 });
};
