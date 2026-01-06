import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { Logger } from '../../packages/shared/src/utilities/logger';
import { IOldRaceUseCase } from '../usecase/interface/IOldRaceUsecase';
import { corsHeaders } from '../utility/cors';
import {
    parseBodyToFilter,
    parseQueryToFilter,
    ValidationError,
} from './requestParser';

@injectable()
export class RaceController {
    public constructor(
        @inject('RaceUsecase')
        private readonly usecase: IOldRaceUseCase,
    ) {}

    /**
     * 選手データを取得する
     * @param searchParams - 検索パラメータ
     */
    @Logger
    public async getRaceEntityList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const searchRaceFilter = parseQueryToFilter(searchParams);

            const entityList =
                await this.usecase.fetchRaceEntityList(searchRaceFilter);

            return Response.json(
                {
                    count: entityList.length,
                    races: entityList,
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
            console.error('Error in getRaceEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }

    /**
     * レースデータを登録・更新する
     * @param request - Requestオブジェクト
     */
    @Logger
    public async postUpsertRace(request: Request): Promise<Response> {
        try {
            const body: unknown = await request.json();
            const searchRaceFilter = parseBodyToFilter(body);

            const upsertResult =
                await this.usecase.upsertRaceEntityList(searchRaceFilter);

            return Response.json(
                {
                    message: 'Upsert race completed',
                    successCount: upsertResult.successCount,
                    failureCount: upsertResult.failureCount,
                    failures: upsertResult.failures,
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
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }
}
