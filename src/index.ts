import 'reflect-metadata';
import { container } from 'tsyringe';
import { PublicGamblingController } from './controller/publicGamblingController';
import { PlayerRepository } from './repository/implement/playerRepository';
import { IPlayerRepository } from './repository/interface/IPlayerRepository';
import { IPlayerService } from './service/interface/IPlayerService';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';

import type { D1Database } from '@cloudflare/workers-types';
import { PlayerService } from './service/implement/playerService';
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

interface PlayerRequest {
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
}

export interface CommonParameter {
    searchParams: URLSearchParams;
    env: Env;
}

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

        const controller = container.resolve(PublicGamblingController);

        try {
            if (pathname === '/players' && request.method === 'GET') {
                return controller.getPlayerEntityList(commonParameter);
            }

            // POST /players - 選手登録/更新
            if (pathname === '/players' && request.method === 'POST') {
                return await controller.postUpsertPlayer(
                    request,
                    commonParameter,
                );
            }

            // ルートエンドポイント - API仕様表示
            if (pathname === '/' && request.method === 'GET') {
                return Response.json(
                    {
                        message: '選手管理システム API',
                        version: '1.0.0',
                        endpoints: {
                            'GET /players':
                                '選手一覧取得（?race_type, ?page, ?limit, ?order_by, ?order_dir）',
                            'POST /players': '選手登録',
                        },
                        race_types_examples: ['KEIRIN', 'AUTORACE', 'BOATRACE'],
                        priority_info:
                            '数値が大きいほど優先度高（0が最高優先度）',
                    },
                    { headers: corsHeaders },
                );
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
                    timestamp: new Date().toISOString(),
                },
                { status: 500, headers: corsHeaders },
            );
        }
    },
};
