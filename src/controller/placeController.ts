import 'reflect-metadata';
import './../utility/format';

import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../repository/entity/filter/searchPlaceFilterEntity';
import { IPlaceUseCase } from '../usecase/interface/IPlaceUsecase';
import { Logger } from '../utility/logger';
import {
    parseBodyToFilter,
    parseSearchDatesAndRaceTypes,
    ValidationError,
} from './requestParser';

@injectable()
export class PlaceController {
    public constructor(
        @inject('PlaceUsecase')
        private readonly usecase: IPlaceUseCase,
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
    public async getPlaceEntityList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const { start, finish, raceTypeList, locationList } =
                parseSearchDatesAndRaceTypes(searchParams);

            const searchPlaceFilter = new SearchPlaceFilterEntity(
                start,
                finish,
                raceTypeList,
                locationList,
            );

            const placeEntityList =
                await this.usecase.fetchPlaceEntityList(searchPlaceFilter);

            return Response.json(
                {
                    count: placeEntityList.length,
                    places: placeEntityList,
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
            console.error('Error in getPlaceEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }

    /**
     * 開催場データを登録・更新する
     * @param request - Requestオブジェクト
     */
    @Logger
    public async postUpsertPlace(request: Request): Promise<Response> {
        try {
            const body = await request.json();
            const searchPlaceFilter = parseBodyToFilter(body as any);

            const upsertResult =
                await this.usecase.upsertPlaceEntityList(searchPlaceFilter);

            return Response.json(
                {
                    message: 'Upsert place completed',
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
            console.error('Error in postUpsertPlace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
