import { CalendarController } from './controller/calendarController';
import { PlaceController } from './controller/placeController';
import { PlayerController } from './controller/playerController';
import { RaceController } from './controller/raceController';
import { container } from './di';
import type { OldCloudFlareEnv } from './utility/cloudFlareEnv';
import { corsHeaders, withCorsHeaders } from './utility/cors';
import { OldEnvStore } from './utility/envStore';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

const isHttpMethod = (method: string): method is HttpMethod =>
    (HTTP_METHODS as readonly string[]).includes(method);

type RouteHandler = (
    request: Request,
    searchParams: URLSearchParams,
) => Promise<Response>;

const responseCors = (): Response => {
    return new Response(null, { headers: corsHeaders() });
};
const responseHealth = (): Response => {
    return new Response('ok health check', {
        status: 200,
        headers: corsHeaders(),
    });
};
const responseNotFound = (): Response => {
    return Response.json(
        { error: 'エンドポイントが見つかりません' },
        { status: 404, headers: corsHeaders() },
    );
};
const responseError = (error: any): Response => {
    console.error('Database error:', error);
    return Response.json(
        { error: 'サーバーエラーが発生しました', details: error.message },
        { status: 500, headers: corsHeaders() },
    );
};

const routes = new Map<string, Partial<Record<HttpMethod, RouteHandler>>>([
    [
        '/player',
        {
            GET: async (_request, searchParams): Promise<Response> =>
                container
                    .resolve(PlayerController)
                    .getPlayerEntityList(searchParams),
            POST: async (request): Promise<Response> =>
                container.resolve(PlayerController).postUpsertPlayer(request),
        },
    ],
    [
        '/race',
        {
            GET: async (_request, searchParams): Promise<Response> =>
                container
                    .resolve(RaceController)
                    .getRaceEntityList(searchParams),
            POST: async (request): Promise<Response> =>
                container.resolve(RaceController).postUpsertRace(request),
        },
    ],
    [
        '/calendar',
        {
            GET: async (_request, searchParams): Promise<Response> =>
                container
                    .resolve(CalendarController)
                    .getCalendarEntityList(searchParams),
            POST: async (request): Promise<Response> =>
                container
                    .resolve(CalendarController)
                    .postUpsertCalendar(request),
        },
    ],
    [
        '/place',
        {
            GET: async (_request, searchParams): Promise<Response> =>
                container
                    .resolve(PlaceController)
                    .getPlaceEntityList(searchParams),
            POST: async (request): Promise<Response> =>
                container.resolve(PlaceController).postUpsertPlace(request),
        },
    ],
]);

const responseMethodNotAllowed = (allowed: string[]): Response => {
    return Response.json(
        { error: 'Method Not Allowed' },
        {
            status: 405,
            headers: withCorsHeaders({ Allow: allowed.join(', ') }),
        },
    );
};

export async function router(
    request: Request,
    env: OldCloudFlareEnv,
): Promise<Response> {
    OldEnvStore.setEnv(env);

    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    const method = request.method.toUpperCase();
    if (method === 'OPTIONS') return responseCors();
    try {
        if (pathname === '/health' && method === 'GET') return responseHealth();

        if (!isHttpMethod(method)) {
            return responseNotFound();
        }

        const route = routes.get(pathname);
        if (!route) {
            return responseNotFound();
        }

        const handler = route[method];
        if (typeof handler !== 'function') {
            return responseMethodNotAllowed(Object.keys(route));
        }

        return await handler(request, searchParams);
    } catch (error: any) {
        return responseError(error);
    }
}
