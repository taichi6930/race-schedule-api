import 'reflect-metadata';

import type { D1Database } from '@cloudflare/workers-types';
import { container } from 'tsyringe';

import type { CommonParameter } from './commonParameter';
import { PlayerController } from './controller/playerController';
import { PlayerRepository } from './repository/implement/playerRepository';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import { PlayerService } from './service/implement/playerService';
import type { IPlayerService } from './service/interface/IPlayerService';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
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
