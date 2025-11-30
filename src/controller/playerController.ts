import 'reflect-metadata';
import './../utility/format';

import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { SearchPlayerFilterEntity } from '../repository/entity/filter/searchPlayerFilterEntity';
import { PlayerEntity } from '../repository/entity/playerEntity';
import { IPlayerUseCase } from '../usecase/interface/IPlayerUsecase';
import { parseRaceTypeListFromSearch, ValidationError } from './requestParser';

const playerUpsertSchema = z
    .object({
        race_type: z.string().min(1, 'race_type is required'),
        player_no: z
            .union([z.string(), z.number()])
            .transform((value) => value.toString())
            .refine((value) => value.length > 0, 'player_no is required'),
        player_name: z.string().min(1, 'player_name is required'),
        priority: z.coerce.number().int('priority must be an integer'),
    })
    .strict();

type PlayerUpsertSchema = z.infer<typeof playerUpsertSchema>;

const playerUpsertPayloadSchema = z.union([
    playerUpsertSchema,
    z.array(playerUpsertSchema),
]);

const parsePlayerUpsertPayload = (body: unknown): PlayerUpsertSchema[] => {
    const result = playerUpsertPayloadSchema.safeParse(body);
    if (!result.success) {
        const issueMessages = result.error.issues.map((issue) => issue.message);
        const message =
            issueMessages.length > 0
                ? `Invalid request body: ${issueMessages.join(', ')}`
                : 'Invalid request body';
        throw new ValidationError(message);
    }

    return Array.isArray(result.data) ? result.data : [result.data];
};

@injectable()
export class PlayerController {
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
                { headers: this.corsHeaders },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: this.corsHeaders,
                });
            }
            console.error('Error in getPlayerEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }

    /**
     * 選手登録/更新
     * @param request - POSTリクエスト
     */
    public async postUpsertPlayer(request: Request): Promise<Response> {
        try {
            const body: unknown = await request.json();
            const playerPayloads = parsePlayerUpsertPayload(body);
            const playerEntityList = playerPayloads.map((item) => {
                try {
                    return PlayerEntity.create(
                        item.race_type,
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
                { status: 201, headers: this.corsHeaders },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: this.corsHeaders,
                });
            }
            console.error('Error in postUpsertPlayer:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
