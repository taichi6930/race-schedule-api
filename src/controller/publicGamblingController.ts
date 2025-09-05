import 'reflect-metadata';
import { CommonParameter } from './../index';

import { container, inject, injectable } from 'tsyringe';
import { PlayerRepository } from '../repository/implement/playerRepository';
import { IPlayerRepository } from '../repository/interface/IPlayerRepository';
import { PlayerService } from '../service/implement/playerService';
import { IPlayerService } from '../service/interface/IPlayerService';
import { PlayerUseCase } from '../usecase/implement/playerUsecase';
import { IPlayerUseCase } from '../usecase/interface/IPlayerUsecase';

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
