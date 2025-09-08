import 'reflect-metadata';

import type { D1Database } from '@cloudflare/workers-types';
import { container } from 'tsyringe';

import type { CommonParameter } from './commonParameter';
import { PlayerController } from './controller/playerController';
import { RaceController } from './controller/raceController';
import { PlayerRepository } from './repository/implement/playerRepository';
import { RaceRepositoryForStorage } from './repository/implement/raceRepositoryStorage';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { PlayerService } from './service/implement/playerService';
import { RaceService } from './service/implement/raceService';
import type { IPlayerService } from './service/interface/IPlayerService';
import type { IRaceService } from './service/interface/IRaceService';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import { RaceUseCase } from './usecase/implement/raceUsecase';
import type { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';
import type { IRaceUseCase } from './usecase/interface/IRaceUsecase';

export interface Env {
    DB: D1Database;
}

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

// container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
//     useClass: RaceDataHtmlGateway,
// });
container.register<IRaceRepository>('RaceRepositoryForStorage', {
    useClass: RaceRepositoryForStorage,
});
// container.register<IRaceRepository>('OverseasRaceRepositoryFromHtml', {
//     useClass: OverseasRaceRepositoryFromHtml,
// });
container.register<IRaceService>('RaceService', {
    useClass: RaceService,
});
container.register<IRaceUseCase>('RaceUsecase', {
    useClass: RaceUseCase,
});

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        const commonParameter: CommonParameter = { searchParams, env };

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const playerController = container.resolve(PlayerController);
        const raceController = container.resolve(RaceController);

        try {
            if (pathname === '/players' && request.method === 'GET') {
                return await playerController.getPlayerEntityList(
                    commonParameter,
                );
            }

            if (pathname === '/players' && request.method === 'POST') {
                return await playerController.postUpsertPlayer(
                    request,
                    commonParameter,
                );
            }

            if (pathname === '/race' && request.method === 'GET') {
                return await raceController.getRaceEntityList(commonParameter);
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
