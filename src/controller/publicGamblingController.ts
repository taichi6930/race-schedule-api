import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { PlayerEntityForAWS } from '../../lib/src/repository/entity/playerEntity';
import { CommonParameter } from '../commonParameter';
import { IPlayerUseCase } from '../usecase/interface/IPlayerUsecase';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    public constructor(
        @inject('PlayerUsecase')
        private readonly usecase: IPlayerUseCase,
    ) {}

    // CORS設定
    private readonly corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    /**
     * 選手データを取得する
     * @param commonParameter - 共通パラメータ
     */
    public async getPlayerEntityList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const playerEntityList =
            await this.usecase.fetchPlayerEntityList(commonParameter);

        return Response.json(
            {
                players: playerEntityList,
                count: playerEntityList.length,
            },
            { headers: this.corsHeaders },
        );
    }

    /**
     * 選手登録/更新
     * @param request - POSTリクエスト
     * @param commonParameter - 共通パラメータ
     */
    public async postUpsertPlayer(
        request: Request,
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const body = await request.json();
            const playerList = Array.isArray(body) ? body : [body];
            const playerEntityList = playerList.map((item: any) =>
                PlayerEntityForAWS.create(
                    item.race_type,
                    item.player_no,
                    item.player_name,
                    item.priority,
                ),
            );
            await this.usecase.upsertPlayerEntityList(
                commonParameter,
                playerEntityList,
            );
            return Response.json(
                {
                    message: '選手を登録/更新しました',
                    playerEntities: playerEntityList,
                },
                { status: 201, headers: this.corsHeaders },
            );
        } catch (error: any) {
            // バリデーション・DBエラー
            return Response.json(
                {
                    error: error.message ?? '登録/更新に失敗しました',
                },
                { status: 400, headers: this.corsHeaders },
            );
        }
    }
}
