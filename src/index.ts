import 'reflect-metadata';

import type { D1Database } from '@cloudflare/workers-types';
import { container } from 'tsyringe';

import type { CommonParameter } from './commonParameter';
import { PlaceController } from './controller/placeController';
import { PlayerController } from './controller/playerController';
import { PlaceRepositoryForStorage } from './repository/implement/placeRepository';
import { PlayerRepository } from './repository/implement/playerRepository';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import { PlaceService } from './service/implement/placeService';
import { PlayerService } from './service/implement/playerService';
import type { IPlaceService } from './service/interface/IPlaceService';
import type { IPlayerService } from './service/interface/IPlayerService';
import { PlaceUseCase } from './usecase/implement/placeUsecase';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import type { IPlaceUseCase } from './usecase/interface/IPlaceUsecase';
import type { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';

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

container.register<IPlaceRepository>('PlaceRepositoryForStorage', {
    useClass: PlaceRepositoryForStorage,
});
container.register<IPlaceService>('PlaceService', {
    useClass: PlaceService,
});
container.register<IPlaceUseCase>('PlaceUsecase', {
    useClass: PlaceUseCase,
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
        const placeController = container.resolve(PlaceController);

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

            if (pathname === '/places' && request.method === 'GET') {
                return await placeController.getPlaceEntityList(
                    commonParameter,
                );
            }

            // // ルートエンドポイント - API仕様表示
            // if (pathname === '/' && request.method === 'GET') {
            //     return Response.json(
            //         {
            //             message: '選手管理システム API',
            //             version: '1.0.0',
            //             endpoints: {
            //                 'GET /players':
            //                     '選手一覧取得（?race_type, ?limit, ?order_by, ?order_dir）',
            //                 'POST /players': '選手登録',
            //                 'GET /places':
            //                     '開催場所一覧取得（?race_type, ?limit, ?order_by, ?order_dir）',
            //             },
            //             race_types_examples: [
            //                 RaceType.JRA,
            //                 RaceType.NAR,
            //                 RaceType.OVERSEAS,
            //                 RaceType.KEIRIN,
            //                 RaceType.AUTORACE,
            //                 RaceType.BOATRACE,
            //             ],
            //             priority_info:
            //                 '数値が大きいほど優先度高（10が最高優先度）',
            //         },
            //         { headers: corsHeaders },
            //     );
            // }

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
                    timestamp: new Date().toISOString(),
                },
                { status: 500, headers: corsHeaders },
            );
        }
    },
};
