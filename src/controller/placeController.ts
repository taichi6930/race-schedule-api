import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../repository/entity/filter/searchPlaceFilterEntity';
import { IPlaceUseCase } from '../usecase/interface/IPlaceUsecase';
import { CommonParameter } from '../utility/commonParameter';
import { Logger } from '../utility/logger';
import { convertRaceTypeList, RaceType } from '../utility/raceType';

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
        commonParameter: CommonParameter,
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const raceTypeParam = searchParams.getAll('raceType');
            const startDateParam = searchParams.get('startDate');
            const finishDateParam = searchParams.get('finishDate');

            const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);

            if (raceTypeList.length === 0) {
                return new Response('Bad Request: Invalid raceType', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            // startDateとfinishDateのバリデーションも行う
            if (
                (startDateParam &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) ||
                !startDateParam
            ) {
                return new Response('Bad Request: Invalid startDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            if (
                (finishDateParam &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(finishDateParam)) ||
                !finishDateParam
            ) {
                return new Response('Bad Request: Invalid finishDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            const searchPlaceFilter = new SearchPlaceFilterEntity(
                new Date(startDateParam),
                new Date(finishDateParam),
                raceTypeList,
            );

            const placeEntityList = await this.usecase.fetchPlaceEntityList(
                commonParameter,
                searchPlaceFilter,
            );

            return Response.json(
                {
                    count: placeEntityList.length,
                    places: placeEntityList,
                },
                { headers: this.corsHeaders },
            );
        } catch (error) {
            console.error('Error in getCalendarEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
