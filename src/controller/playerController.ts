import 'reflect-metadata';
import './../utility/format';

import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../repository/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../repository/entity/playerEntity';
import { IPlayerUseCase } from '../usecase/interface/IPlayerUsecase';
import { corsHeaders } from '../utility/cors';
import { parseRaceTypeListFromSearch, ValidationError } from './requestParser';

@injectable()
export class PlayerController {
    public constructor(
        @inject('PlayerUsecase')
        private readonly usecase: IPlayerUseCase,
    ) {}

    /**
     * 選手データを取得する
     * @param searchParams
     */
    public async getPlayerEntityList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const raceTypeList = parseRaceTypeListFromSearch(searchParams);
            const searchPlayerFilter = new SearchPlayerFilterEntity(
                raceTypeList,
            );

            const playerEntityList =
                await this.usecase.fetchPlayerEntityList(searchPlayerFilter);

            return Response.json(
                {
                    count: playerEntityList.length,
                    players: playerEntityList,
                },
                { headers: corsHeaders() },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: corsHeaders(),
                });
            }
            console.error('Error in getPlayerEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }

    /**
     * 選手登録/更新
     * @param request - POSTリクエスト
     */
    public async postUpsertPlayer(request: Request): Promise<Response> {
        try {
            const body = await request.json();
            const playerList = Array.isArray(body) ? body : [body];
            const playerEntityList = playerList.map((item: any) =>
                PlayerEntity.create(
                    item.race_type,
                    item.player_no,
                    item.player_name,
                    item.priority,
                ),
            );
            await this.usecase.upsertPlayerEntityList(playerEntityList);
            return Response.json(
                {
                    message: '選手を登録/更新しました',
                    playerEntities: playerEntityList,
                },
                { status: 201, headers: corsHeaders() },
            );
        } catch (error: any) {
            // バリデーション・DBエラー
            return Response.json(
                {
                    error: error.message ?? '登録/更新に失敗しました',
                },
                { status: 400, headers: corsHeaders() },
            );
        }
    }
}
