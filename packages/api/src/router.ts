import { CourseController } from './controller/courseController';
import { container, setupDi } from './di';

// Minimal CORS helpers (kept local to package)
type HeaderRecord = Record<string, string>;
const BASE_CORS_HEADERS: HeaderRecord = Object.freeze({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
});
const corsHeaders = (): HeaderRecord => ({ ...BASE_CORS_HEADERS });
const withCorsHeaders = (headers?: HeadersInit): HeaderRecord => ({
    ...BASE_CORS_HEADERS,
    ...(headers ? Object.fromEntries(new Headers(headers) as any) : {}),
});

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];
const isHttpMethod = (method: string): method is HttpMethod =>
    (HTTP_METHODS as readonly string[]).includes(method);

type RouteHandler = (
    request: Request,
    searchParams: URLSearchParams,
) => Promise<Response>;

const responseCors = (): Response =>
    new Response(null, { headers: corsHeaders() });
const responseHealth = (): Response =>
    new Response('ok health check', { status: 200, headers: corsHeaders() });
const responseNotFound = (): Response =>
    Response.json(
        { error: 'エンドポイントが見つかりません' },
        { status: 404, headers: corsHeaders() },
    );
const responseError = (error: any): Response =>
    Response.json(
        { error: 'サーバーエラーが発生しました', details: error?.message },
        { status: 500, headers: corsHeaders() },
    );

const routes = new Map<string, Partial<Record<HttpMethod, RouteHandler>>>([
    [
        '/course',
        {
            GET: async (
                _request: Request,
                searchParams: URLSearchParams,
            ): Promise<Response> =>
                container.resolve(CourseController).getCourseList(searchParams),
        },
    ],
]);

const responseMethodNotAllowed = (allowed: string[]): Response =>
    Response.json(
        { error: 'Method Not Allowed' },
        {
            status: 405,
            headers: withCorsHeaders({ Allow: allowed.join(', ') }),
        },
    );

export async function router(
    request: Request,
    _env: unknown,
): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    void _env;
    // Initialize DI for this invocation based on provided env or process.env
    const resolveEnv = (envObj: unknown): 'local' | 'test' | 'production' => {
        try {
            if (envObj && typeof envObj === 'object') {
                const anyEnv = envObj as any;
                if (typeof anyEnv.NODE_ENV === 'string')
                    return anyEnv.NODE_ENV as any;
                if (typeof anyEnv.ENV_NAME === 'string')
                    return anyEnv.ENV_NAME as any;
            }
        } catch {
            // ignore
        }
        const proc = (globalThis as any).process;
        if (proc?.env && typeof proc.env.NODE_ENV === 'string') {
            return proc.env.NODE_ENV as any;
        }
        return 'local';
    };

    setupDi(resolveEnv(_env));
    const method = request.method.toUpperCase();
    if (method === 'OPTIONS') return responseCors();

    try {
        if (pathname === '/health' && method === 'GET') return responseHealth();
        if (!isHttpMethod(method)) return responseNotFound();

        const route = routes.get(pathname);
        if (!route) return responseNotFound();

        const handler = route[method];
        if (typeof handler !== 'function')
            return responseMethodNotAllowed(Object.keys(route));

        return await handler(request, searchParams);
    } catch (error: any) {
        return responseError(error);
    }
}
