import 'reflect-metadata';
import { CommonParameter } from './../index';

import { inject, injectable } from 'tsyringe';
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
        const players = await this.usecase.getPlayerData(commonParameter);

        // CORS設定
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        return Response.json(
            {
                players: players,
                total: players.length,
            },
            { headers: corsHeaders },
        );
    }
}
