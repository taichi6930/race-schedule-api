import 'reflect-metadata';
import { CommonParameter } from './../index';

import { inject, injectable } from 'tsyringe';
import { PlayerEntity } from '../../lib/src/repository/entity/playerEntity';
import { PlayerRegisterDTO } from '../repository/implement/playerRepository';
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

    // CORS設定
    private corsHeaders = {
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
        const players =
            await this.usecase.fetchPlayerEntityList(commonParameter);

        return Response.json(
            {
                players: players,
                total: players.length,
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
            const body = (await request.json()) as PlayerRegisterDTO;
            const dto: PlayerRegisterDTO = {
                race_type: body.race_type,
                player_no: body.player_no,
                player_name: body.player_name,
                priority: body.priority,
            };
            const playerEntity = PlayerEntity.create(
                dto.race_type,
                dto.player_no,
                dto.player_name,
                dto.priority,
            );
            await this.usecase.upsertPlayerEntity(dto, commonParameter);
            return Response.json(
                {
                    message: '選手を登録/更新しました',
                    dto: dto,
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
