import { courseController } from './di';
import { calendarController } from './di.calendar';

export const router = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/courses') {
        return courseController.getCourseList(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/calendar') {
        // クエリパラメータをURLSearchParamsからobjectに変換
        return calendarController.getCalendarList(url.searchParams);
    }
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/api', { status: 200 });
    }
    // 他のルーティングもここに追加
    return new Response('Not Found', { status: 404 });
};
