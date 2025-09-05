import 'reflect-metadata';
import { CommonParameter } from './../index';

import { container, injectable } from 'tsyringe';
import { PlayerRepository } from '../repository/implement/playerRepository';
import { IPlayerRepository } from '../repository/interface/IPlayerRepository';

container.register<IPlayerRepository>('PlayerRepositor', {
    useClass: PlayerRepository,
});

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    constructor(private usecase = new PlayerUseCase()) {}

    /**
     * 選手データを取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    public async getPlayerDataList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const { results } =
            await this.usecase.getPlayerDataCount(commonParameter);

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

class PlayerUseCase {
    constructor(private service = new PlayerService()) {}

    public async getPlayerDataCount(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        return await this.service.getPlayerData(commonParameter);
    }
}

class PlayerService {
    constructor(private repository = new PlayerRepository()) {}

    public async getPlayerData(
        commonParameter: CommonParameter,
    ): Promise<{ results: any[] }> {
        const results =
            await this.repository.getPlayerDataList(commonParameter);
        return { results };
    }
}
