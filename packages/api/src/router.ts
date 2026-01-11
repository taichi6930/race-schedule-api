import { calendarController } from './di.calendar';
import { courseController } from './di.course';
import { placeController } from './di.place';

export const router = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/courses') {
        return courseController.getCourseList(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/calendar') {
        return calendarController.getCalendarList(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/place') {
        return placeController.getPlaceList(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/api', { status: 200 });
    }
    return new Response('Not Found', { status: 404 });
};
