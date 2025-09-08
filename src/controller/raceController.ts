import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../commonParameter';
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
        const raceEntityList =
            await this.usecase.fetchRaceEntityList(commonParameter);

        return Response.json(
            {
                count: raceEntityList.length,
                races: raceEntityList,
            },
            { headers: this.corsHeaders },
        );
    }
}
