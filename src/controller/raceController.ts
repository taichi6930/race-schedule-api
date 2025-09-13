import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IRaceUseCase } from '../usecase/interface/IRaceUsecase';
import { CommonParameter } from '../utility/commonParameter';
import { Logger } from '../utility/logger';
import {
    parseBodyToFilter,
    parseQueryToFilter,
    ValidationError,
} from './requestParser';

@injectable()
export class RaceController {
    public constructor(
        @inject('RaceUsecase')
        private readonly usecase: IRaceUseCase,
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
     * @param searchParams
     */
    @Logger
    public async getRaceEntityList(
        commonParameter: CommonParameter,
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const searchRaceFilter = parseQueryToFilter(searchParams);

            const raceEntityList = await this.usecase.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
            );

            return Response.json(
                {
                    count: raceEntityList.length,
                    races: raceEntityList,
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
            console.error('Error in getCalendarEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }

    /**
     * レースデータを登録・更新する
     * @param request - Requestオブジェクト
     * @param commonParameter - 共通パラメータ
     */
    @Logger
    public async postUpsertRace(
        request: Request,
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const body = await request.json();
            const searchRaceFilter = parseBodyToFilter(body as any);

            const upsertResult = await this.usecase.upsertRaceEntityList(
                commonParameter,
                searchRaceFilter,
            );

            return Response.json(
                {
                    message: 'Upsert completed',
                    successCount: upsertResult.successCount,
                    failureCount: upsertResult.failureCount,
                    failures: upsertResult.failures,
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
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
