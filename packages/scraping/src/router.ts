import './di';

export const router = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok health check packages/scraping', {
            status: 200,
        });
    }
    return new Response('Not Found', { status: 404 });
};
