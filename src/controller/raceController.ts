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

    // /**
    //  * 選手登録/更新
    //  * @param request - POSTリクエスト
    //  * @param commonParameter - 共通パラメータ
    //  */
    // public async postUpsertRace(
    //     request: Request,
    //     commonParameter: CommonParameter,
    // ): Promise<Response> {
    //     try {
    //         const body = await request.json();
    //         const raceList = Array.isArray(body) ? body : [body];
    //         const raceEntityList = raceList.map((item: any) =>
    //             RaceEntity.create(
    //                 item.race_type,
    //                 item.race_no,
    //                 item.race_name,
    //                 item.priority,
    //             ),
    //         );
    //         await this.usecase.upsertRaceEntityList(
    //             commonParameter,
    //             raceEntityList,
    //         );
    //         return Response.json(
    //             {
    //                 message: '選手を登録/更新しました',
    //                 raceEntities: raceEntityList,
    //             },
    //             { status: 201, headers: this.corsHeaders },
    //         );
    //     } catch (error: any) {
    //         // バリデーション・DBエラー
    //         return Response.json(
    //             {
    //                 error: error.message ?? '登録/更新に失敗しました',
    //             },
    //             { status: 400, headers: this.corsHeaders },
    //         );
    //     }
    // }
}
