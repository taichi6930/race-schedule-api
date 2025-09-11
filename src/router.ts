import { CalendarController } from './controller/calendarController';
import { PlaceController } from './controller/placeController';
import { PlayerController } from './controller/playerController';
import { RaceController } from './controller/raceController';
import { container } from './di';
import type { CloudFlareEnv, CommonParameter } from './utility/commonParameter';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function responseCors(): Response {
    return new Response(null, { headers: corsHeaders });
}
function responseHealth(): Response {
    return new Response('ok health check', {
        status: 200,
        headers: corsHeaders,
    });
}
function responseNotFound(): Response {
    return Response.json(
        { error: 'エンドポイントが見つかりません' },
        { status: 404, headers: corsHeaders },
    );
}
function responseError(error: any): Response {
    console.error('Database error:', error);
    return Response.json(
        { error: 'サーバーエラーが発生しました', details: error.message },
        { status: 500, headers: corsHeaders },
    );
}

async function handlePlayer(
    request: Request,
    commonParameter: CommonParameter,
    searchParams: URLSearchParams,
): Promise<Response> {
    const playerController = container.resolve(PlayerController);
    if (request.method === 'GET') {
        return playerController.getPlayerEntityList(
            commonParameter,
            searchParams,
        );
    }
    if (request.method === 'POST') {
        return playerController.postUpsertPlayer(request, commonParameter);
    }
    return responseNotFound();
}

async function handleRace(
    request: Request,
    commonParameter: CommonParameter,
    searchParams: URLSearchParams,
): Promise<Response> {
    const raceController = container.resolve(RaceController);
    if (request.method === 'GET') {
        return raceController.getRaceEntityList(commonParameter, searchParams);
    }
    if (request.method === 'POST') {
        return raceController.postUpsertRace(request, commonParameter);
    }
    return responseNotFound();
}

async function handleCalendar(
    request: Request,
    commonParameter: CommonParameter,
    searchParams: URLSearchParams,
): Promise<Response> {
    const calendarController = container.resolve(CalendarController);
    if (request.method === 'GET') {
        return calendarController.getCalendarEntityList(
            commonParameter,
            searchParams,
        );
    }
    if (request.method === 'POST') {
        return calendarController.postUpsertCalendar(request, commonParameter);
    }
    return responseNotFound();
}

async function handlePlace(
    request: Request,
    commonParameter: CommonParameter,
    searchParams: URLSearchParams,
): Promise<Response> {
    const placeController = container.resolve(PlaceController);
    if (request.method === 'GET') {
        return placeController.getPlaceEntityList(
            commonParameter,
            searchParams,
        );
    }
    if (request.method === 'POST') {
        return placeController.postUpsertPlace(request, commonParameter);
    }
    return responseNotFound();
}

export async function router(
    request: Request,
    env: CloudFlareEnv,
): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    const commonParameter: CommonParameter = { env };

    if (request.method === 'OPTIONS') return responseCors();
    try {
        if (pathname === '/health' && request.method === 'GET')
            return responseHealth();

        switch (pathname) {
            case '/player': {
                return await handlePlayer(
                    request,
                    commonParameter,
                    searchParams,
                );
            }
            case '/race': {
                return await handleRace(request, commonParameter, searchParams);
            }
            case '/calendar': {
                return await handleCalendar(
                    request,
                    commonParameter,
                    searchParams,
                );
            }
            case '/place': {
                return await handlePlace(
                    request,
                    commonParameter,
                    searchParams,
                );
            }
            default: {
                return responseNotFound();
            }
        }
    } catch (error: any) {
        return responseError(error);
    }
}
