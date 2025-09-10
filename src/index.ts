import 'reflect-metadata';

import { container } from 'tsyringe';

import { CalendarController } from './controller/calendarController';
import { PlaceController } from './controller/placeController';
import { PlayerController } from './controller/playerController';
import { RaceController } from './controller/raceController';
import { GoogleCalendarGateway } from './gateway/implement/googleCalendarGateway';
import { PlaceDataHtmlGateway } from './gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from './gateway/implement/raceDataHtmlGateway';
import type { ICalendarGateway } from './gateway/interface/iCalendarGateway';
import type { IPlaceDataHtmlGateway } from './gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from './gateway/interface/iRaceDataHtmlGateway';
import { GoogleCalendarRepository } from './repository/implement/googleCalendarRepository';
import { JraRaceRepositoryFromHtml } from './repository/implement/jraRaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from './repository/implement/narRaceRepositoryFromHtml';
import { OverseasRaceRepositoryFromHtml } from './repository/implement/overseasRaceRepositoryFromHtml';
import { PlaceRepositoryForStorage } from './repository/implement/placeRepositoryForStorage';
import { PlaceRepositoryFromHtml } from './repository/implement/placeRepositoryFromHtml';
import { PlayerRepository } from './repository/implement/playerRepository';
import { RaceRepositoryForStorage } from './repository/implement/raceRepositoryStorage';
import type { ICalendarRepository } from './repository/interface/ICalendarRepository';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { CalendarService } from './service/implement/calendarService';
import { PlaceService } from './service/implement/placeService';
import { PlayerService } from './service/implement/playerService';
import { RaceService } from './service/implement/raceService';
import type { ICalendarService } from './service/interface/ICalendarService';
import type { IPlaceService } from './service/interface/IPlaceService';
import type { IPlayerService } from './service/interface/IPlayerService';
import type { IRaceService } from './service/interface/IRaceService';
import { CalendarUseCase } from './usecase/implement/calendarUseCase';
import { PlaceUseCase } from './usecase/implement/placeUsecase';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import { RaceUseCase } from './usecase/implement/raceUsecase';
import type { ICalendarUseCase } from './usecase/interface/ICalendarUseCase';
import type { IPlaceUseCase } from './usecase/interface/IPlaceUsecase';
import type { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';
import type { IRaceUseCase } from './usecase/interface/IRaceUsecase';
import type { CloudFlareEnv, CommonParameter } from './utility/commonParameter';

// DI登録
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
container.register<IPlayerService>('PlayerService', {
    useClass: PlayerService,
});
container.register<IPlayerUseCase>('PlayerUsecase', {
    useClass: PlayerUseCase,
});

container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
    useClass: RaceDataHtmlGateway,
});
container.register<IRaceRepository>('RaceRepositoryForStorage', {
    useClass: RaceRepositoryForStorage,
});
container.register<IRaceRepository>('OverseasRaceRepositoryFromHtml', {
    useClass: OverseasRaceRepositoryFromHtml,
});
container.register<IRaceRepository>('NarRaceRepositoryFromHtml', {
    useClass: NarRaceRepositoryFromHtml,
});
container.register<IRaceRepository>('JraRaceRepositoryFromHtml', {
    useClass: JraRaceRepositoryFromHtml,
});
container.register<IRaceService>('RaceService', {
    useClass: RaceService,
});
container.register<IRaceUseCase>('RaceUsecase', {
    useClass: RaceUseCase,
});

container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
    useClass: PlaceDataHtmlGateway,
});
container.register<IPlaceRepository>('PlaceRepositoryForStorage', {
    useClass: PlaceRepositoryForStorage,
});
container.register<IPlaceRepository>('PlaceRepositoryFromHtml', {
    useClass: PlaceRepositoryFromHtml,
});
container.register<IPlaceService>('PlaceService', {
    useClass: PlaceService,
});
container.register<IPlaceUseCase>('PlaceUsecase', {
    useClass: PlaceUseCase,
});

container.register<ICalendarGateway>('GoogleCalendarGateway', {
    useClass: GoogleCalendarGateway,
});
container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
container.register<ICalendarService>('CalendarService', {
    useClass: CalendarService,
});
container.register<ICalendarUseCase>('CalendarUsecase', {
    useClass: CalendarUseCase,
});

export default {
    async fetch(request: Request, env: CloudFlareEnv): Promise<Response> {
        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        const commonParameter: CommonParameter = { env };

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            if (pathname === '/health' && request.method === 'GET') {
                return new Response('ok health check', {
                    status: 200,
                    headers: corsHeaders,
                });
            }

            if (pathname === '/player') {
                const playerController = container.resolve(PlayerController);
                if (request.method === 'GET') {
                    return await playerController.getPlayerEntityList(
                        commonParameter,
                        searchParams,
                    );
                }

                if (request.method === 'POST') {
                    return await playerController.postUpsertPlayer(
                        request,
                        commonParameter,
                    );
                }
            }

            if (pathname === '/race') {
                const raceController = container.resolve(RaceController);
                if (request.method === 'GET') {
                    return await raceController.getRaceEntityList(
                        commonParameter,
                        searchParams,
                    );
                }

                if (request.method === 'POST') {
                    return await raceController.postUpsertRace(
                        request,
                        commonParameter,
                    );
                }
            }

            if (pathname === '/calendar') {
                const calendarController =
                    container.resolve(CalendarController);
                if (request.method === 'GET') {
                    return await calendarController.getCalendarEntityList(
                        commonParameter,
                        searchParams,
                    );
                }

                if (request.method === 'POST') {
                    return await calendarController.postUpsertCalendar(
                        request,
                        commonParameter,
                    );
                }
            }

            if (pathname === '/place') {
                const placeController = container.resolve(PlaceController);
                if (request.method === 'GET') {
                    return await placeController.getPlaceEntityList(
                        commonParameter,
                        searchParams,
                    );
                }

                if (request.method === 'POST') {
                    return await placeController.postUpsertPlace(
                        request,
                        commonParameter,
                    );
                }
            }

            // 404 Not Found
            return Response.json(
                { error: 'エンドポイントが見つかりません' },
                { status: 404, headers: corsHeaders },
            );
        } catch (error: any) {
            console.error('Database error:', error);
            return Response.json(
                {
                    error: 'サーバーエラーが発生しました',
                    details: error.message,
                },
                { status: 500, headers: corsHeaders },
            );
        }
    },
};
