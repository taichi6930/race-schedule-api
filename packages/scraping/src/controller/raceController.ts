import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceUsecase } from '../usecase/raceUsecase';

@injectable()
export class RaceController {
    public constructor(
        @inject('RaceUsecase') private readonly usecase: RaceUsecase,
    ) {}

    /**
     * GET /scraping/race?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA&locationList=東京
     */
    public async get(searchParams: URLSearchParams): Promise<Response> {
        try {
            const startDate = searchParams.get('startDate');
            const finishDate = searchParams.get('finishDate');
            const raceTypeListRaw = searchParams.get('raceTypeList');
            const locationListRaw = searchParams.get('locationList');
            const gradeListRaw = searchParams.get('gradeList');

            // 必須パラメータチェック
            if (!startDate || !finishDate) {
                return Response.json(
                    { error: 'startDate, finishDateは必須です' },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }
            if (!raceTypeListRaw) {
                return Response.json(
                    { error: 'raceTypeListは必須です' },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }

            // raceTypeListの妥当性チェック
            const raceTypeList = raceTypeListRaw
                .split(',')
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
            if (raceTypeList.length === 0) {
                return Response.json(
                    { error: 'raceTypeListに有効な値がありません' },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }

            // 日付の妥当性チェック
            const startDateObj = new Date(startDate);
            const finishDateObj = new Date(finishDate);
            if (
                Number.isNaN(startDateObj.getTime()) ||
                Number.isNaN(finishDateObj.getTime())
            ) {
                return Response.json(
                    {
                        error: 'startDate, finishDateは有効な日付文字列で指定してください',
                    },
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }

            // locationList（カンマ区切り or undefined）
            let locationList: string[] | undefined = undefined;
            if (locationListRaw) {
                locationList = locationListRaw
                    .split(',')
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);
            }

            // gradeList（カンマ区切り or undefined）
            let gradeList: string[] | undefined = undefined;
            if (gradeListRaw) {
                gradeList = gradeListRaw
                    .split(',')
                    .map((v) => v.trim())
                    .filter((v) => v.length > 0);
            }

            // usecase呼び出し
            const filter = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
                locationList,
                gradeList,
            };
            const data = await this.usecase.fetch(filter);

            // Entity→DTO変換
            const races = data.map((e: any) => ({
                raceType: e.raceType,
                datetime: e.datetime,
                location: e.location,
                raceNumber: e.raceNumber,
                raceName: e.raceName,
                grade: e.grade,
                distance: e.distance,
                surfaceType: e.surfaceType,
                stage: e.stage,
            }));

            return Response.json(
                {
                    count: races.length,
                    races,
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        } catch (error) {
            console.error('Error in getRaceList:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}
