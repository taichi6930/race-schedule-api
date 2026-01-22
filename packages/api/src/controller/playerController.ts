import 'reflect-metadata';

import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import { SearchPlayerFilterEntity } from '../domain/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../domain/entity/playerEntity';
import {
    parsePlayerUpsertPayload,
    ValidationError,
} from '../domain/validation/playerValidation';
import { IPlayerUsecase } from '../usecase/interface/IPlayerUsecase';

const corsHeaders = (): Record<string, string> => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
});

const parseRaceTypeListFromSearch = (
    searchParams: URLSearchParams,
): RaceType[] => {
    const raceTypeList = searchParams.getAll('raceType');
    return raceTypeList.filter((type): type is RaceType =>
        ['JRA', 'NAR', 'OVERSEAS', 'KEIRIN', 'AUTORACE', 'BOATRACE'].includes(
            type.toUpperCase(),
        ),
    ) as RaceType[];
};

const validateRaceType = (value: string): RaceType => {
    const upperValue = value.toUpperCase();
    if (
        ['JRA', 'NAR', 'OVERSEAS', 'KEIRIN', 'AUTORACE', 'BOATRACE'].includes(
            upperValue,
        )
    ) {
        return upperValue as RaceType;
    }
    throw new Error(`Invalid race type: ${value}`);
};

@injectable()
export class PlayerController {
    public constructor(
        @inject('PlayerUsecase')
        private readonly usecase: IPlayerUsecase,
    ) {}

    /**
     * 選手データを取得する
     * @param searchParams
     */
    public async get(searchParams: URLSearchParams): Promise<Response> {
        try {
            const raceTypeList = parseRaceTypeListFromSearch(searchParams);
            if (raceTypeList.length === 0) {
                return Response.json(
                    { error: 'raceType を1つ以上指定してください' },
                    {
                        status: 400,
                        headers: corsHeaders(),
                    },
                );
            }
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
            console.error('Error in get:', error);
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
    public async upsert(request: Request): Promise<Response> {
        try {
            const body: unknown = await request.json();
            const playerPayloads = parsePlayerUpsertPayload(body);
            const playerEntityList = playerPayloads.map((item) => {
                try {
                    return PlayerEntity.create(
                        validateRaceType(item.race_type),
                        item.player_no,
                        item.player_name,
                        item.priority,
                    );
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'Invalid player request';
                    throw new ValidationError(message);
                }
            });
            await this.usecase.upsertPlayerEntityList(playerEntityList);
            return Response.json(
                {
                    message: '選手を登録/更新しました',
                    playerEntities: playerEntityList,
                },
                { status: 201, headers: corsHeaders() },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: corsHeaders(),
                });
            }
            console.error('Error in upsert:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }
}
