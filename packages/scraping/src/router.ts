import './di';

import { container } from 'tsyringe';

import { PlaceController } from './controller/placeController';
import { RaceController } from './controller/raceController';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const router = async (request: Request): Promise<Response> => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders,
        });
    }

    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/scraping/place') {
        const placeController = container.resolve(PlaceController);
        const response = await placeController.get(url.searchParams);
        // Add CORS headers to response
        for (const [key, value] of Object.entries(corsHeaders)) {
            response.headers.set(key, value);
        }
        return response;
    }
    if (request.method === 'GET' && url.pathname === '/scraping/race') {
        const raceController = container.resolve(RaceController);
        const response = await raceController.get(url.searchParams);
        // Add CORS headers to response
        for (const [key, value] of Object.entries(corsHeaders)) {
            response.headers.set(key, value);
        }
        return response;
    }
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/scraping', {
            status: 200,
            headers: corsHeaders,
        });
    }
    return new Response('Not Found', {
        status: 404,
        headers: corsHeaders,
    });
};
