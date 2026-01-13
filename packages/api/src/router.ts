import { calendarController } from './di.calendar';
import { courseController } from './di.course';
import { placeController } from './di.place';
import { raceController } from './di.race';

export const router = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/course') {
        return courseController.get(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/calendar') {
        return calendarController.get(url.searchParams);
    }
    if (url.pathname === '/place') {
        if (request.method === 'GET') {
            return placeController.get(url.searchParams);
        }
        if (request.method === 'POST') {
            return placeController.upsert(request);
        }
    }
    if (url.pathname === '/race') {
        if (request.method === 'GET') {
            return raceController.get(url.searchParams);
        }
        if (request.method === 'POST') {
            return raceController.upsert(request);
        }
    }
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/api', { status: 200 });
    }
    return new Response('Not Found', { status: 404 });
};
