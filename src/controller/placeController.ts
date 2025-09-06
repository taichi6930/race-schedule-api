import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CommonParameter } from '../commonParameter';
import { IPlaceUseCase } from '../usecase/interface/IPlaceUsecase';

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
        const placeEntityList =
            await this.usecase.fetchPlaceEntityList(commonParameter);

        return Response.json(
            {
                places: placeEntityList,
                count: placeEntityList.length,
            },
            { headers: this.corsHeaders },
        );
    }
}
