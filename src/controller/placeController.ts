import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import {
    type RaceType,
    validateRaceType,
} from '../../lib/src/utility/raceType';
import { CommonParameter } from '../commonParameter';
import { IPlaceUseCase } from '../usecase/interface/IPlaceUsecase';
import { parseToDateAssumeJst } from '../util/datetime';

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
     */
    public async getPlaceEntityList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const raceTypeParam = commonParameter.searchParams.get('race_type');
        const startDateParam = commonParameter.searchParams.get('start_date');
        const endDateParam = commonParameter.searchParams.get('end_date');

        // 必須パラメータが揃っていない場合は 404 を返す
        if (!raceTypeParam || !startDateParam || !endDateParam) {
            return Response.json(
                {
                    error: 'Required query parameters missing: race_type, start_date, end_date',
                },
                { status: 404, headers: this.corsHeaders },
            );
        }

        const raceType: RaceType = validateRaceType(raceTypeParam);
        const startDate: Date = parseToDateAssumeJst(startDateParam);
        const endDate: Date = parseToDateAssumeJst(endDateParam);

        const placeEntityList = await this.usecase.fetchPlaceEntityList(
            commonParameter,
            raceType,
            startDate,
            endDate,
        );

        return Response.json(
            {
                count: placeEntityList.length,
                places: placeEntityList,
            },
            { headers: this.corsHeaders },
        );
    }

    public async postUpsertPlace(
        request: Request,
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const body: any = await request.json();
            const raceType = validateRaceType(body.race_type);
            const startDate = parseToDateAssumeJst(body.start_date);
            const endDate = parseToDateAssumeJst(body.end_date);

            await this.usecase.upsertPlaceEntityList(
                commonParameter,
                raceType,
                startDate,
                endDate,
            );
            return Response.json(
                {
                    message: 'Place entities upsert successfully',
                },
                { headers: this.corsHeaders },
            );
        } catch (error) {
            return Response.json(
                {
                    message: 'Error occurred while upserting Place entities',
                    error:
                        error instanceof Error ? error.message : String(error),
                },
                { status: 500, headers: this.corsHeaders },
            );
        }
    }
}
