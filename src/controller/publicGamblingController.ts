import 'reflect-metadata';
import { CommonParameter } from './../index';

import { container, inject, injectable } from 'tsyringe';
import { PlayerRepository } from '../repository/implement/playerRepository';
import { IPlayerRepository } from '../repository/interface/IPlayerRepository';
import { PlayerService } from '../service/implement/PlayerService';
import { IPlayerService } from '../service/interface/IPlayerService';
// ...existing code...

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    constructor(
        @inject('PlayerUsecase')
        private readonly usecase: IPlayerUseCase,
    ) {}

    /**
     * 選手データを取得する
     * @param commonParameter - 共通パラメータ
     */
    public async getPlayerDataList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const { results } = await this.usecase.getPlayerData(commonParameter);

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return Response.json(
            {
                players: results,
                total: results.length,
            },
            { headers: corsHeaders },
        );
    }
}

// DIコンテナからコントローラーを取得する例
// const controller = container.resolve(PublicGamblingController);

// UseCase層
export interface IPlayerUseCase {
    getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }>;
}

@injectable()
export class PlayerUseCase implements IPlayerUseCase {
    constructor(
        @inject('PlayerService')
        private readonly service: IPlayerService,
    ) {}
    public async getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        return await this.service.getPlayerData(commonParameter);
    }
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
