import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { Logger } from '../../packages/shared/src/utilities/logger';
import { IOldPlaceUseCase } from '../usecase/interface/IOldPlaceUsecase';
import { corsHeaders } from '../utility/cors';
import { OldSearchPlaceFilterEntity } from './../repository/entity/filter/oldSearchPlaceFilterEntity';
import {
    parseBodyToFilter,
    parseSearchDatesAndRaceTypes,
    ValidationError,
} from './requestParser';

@injectable()
export class PlaceController {
    public constructor(
        @inject('PlaceUsecase')
        private readonly usecase: IOldPlaceUseCase,
    ) {}

    /**
     * 選手データを取得する
     * @param searchParams
     */
    @Logger
    public async getPlaceEntityList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const { start, finish, raceTypeList, locationList } =
                parseSearchDatesAndRaceTypes(searchParams);

            const searchPlaceFilter = new OldSearchPlaceFilterEntity(
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
                { headers: corsHeaders() },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: corsHeaders(),
                });
            }
            console.error('Error in getPlaceEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
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
            const body: unknown = await request.json();
            const searchPlaceFilter = parseBodyToFilter(body);

            const upsertResult =
                await this.usecase.upsertPlaceEntityList(searchPlaceFilter);

            return Response.json(
                {
                    message: 'Upsert place completed',
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
            console.error('Error in postUpsertPlace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }
}
