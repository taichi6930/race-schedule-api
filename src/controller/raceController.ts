import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { isRaceType, validateRaceType } from '../../lib/src/utility/raceType';
import { CommonParameter } from '../commonParameter';
import { SearchRaceFilterEntity } from '../repository/entity/searchRaceFilterEntity';
import { IRaceUseCase } from '../usecase/interface/IRaceUsecase';

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
     */
    public async getRaceEntityList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        const raceTypeParam = commonParameter.searchParams.get('raceType');
        const startDateParam = commonParameter.searchParams.get('startDate');
        const finishDateParam = commonParameter.searchParams.get('finishDate');

        if (!isRaceType(raceTypeParam)) {
            return new Response('Bad Request: Invalid raceType', {
                status: 400,
                headers: this.corsHeaders,
            });
        }
        // startDateとfinishDateのバリデーションも行う
        if (
            (startDateParam && !/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) ||
            !startDateParam
        ) {
            return new Response('Bad Request: Invalid startDate', {
                status: 400,
                headers: this.corsHeaders,
            });
        }
        if (
            (finishDateParam && !/^\d{4}-\d{2}-\d{2}$/.test(finishDateParam)) ||
            !finishDateParam
        ) {
            return new Response('Bad Request: Invalid finishDate', {
                status: 400,
                headers: this.corsHeaders,
            });
        }
        const raceType = validateRaceType(raceTypeParam);
        const searchRaceFilter = new SearchRaceFilterEntity(
            new Date(startDateParam),
            new Date(finishDateParam),
            raceType,
        );

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
    }
}
