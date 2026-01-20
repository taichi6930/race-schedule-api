import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { PlaceUsecase } from '../usecase/placeUsecase';

// 必要に応じて型を定義（apiのものを流用する場合はimportに修正）
interface PlaceEntity {
    placeId: string;
    raceType: string;
    datetime: Date;
    placeName: string;
    placeHeldDays: any;
    locationCode?: string;
    placeGrade?: string;
    locationName?: string;
}

@injectable()
export class PlaceController {
    public constructor(
        @inject('PlaceUsecase') private readonly usecase: PlaceUsecase, // scraping用のusecase型に合わせて修正
    ) {}

    /**
     * GET /scraping/place?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA
     */
    public async get(searchParams: URLSearchParams): Promise<Response> {
        try {
            const startDate = searchParams.get('startDate');
            const finishDate = searchParams.get('finishDate');
            const raceTypeListRaw = searchParams.get('raceTypeList');
            const locationListRaw = searchParams.get('locationList');

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

            // usecase呼び出し（scraping用に適宜修正）
            const filter = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
                locationList,
            };
            const data = await this.usecase.fetch(filter);
            // Entity→DTO変換（locationCodeを除外）
            const places = data
                .filter(
                    (e: PlaceEntity) =>
                        !locationList ||
                        (e.locationCode &&
                            locationList.includes(e.locationCode)),
                )
                .map((e: PlaceEntity) => ({
                    placeId: e.placeId,
                    raceType: e.raceType,
                    datetime: e.datetime,
                    placeName: e.placeName,
                    locationName: e.locationName ?? e.placeName,
                    placeGrade: e.placeGrade,
                    placeHeldDays: e.placeHeldDays,
                }));
            return Response.json(
                {
                    count: places.length,
                    places,
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        } catch (error) {
            console.error('Error in getPlaceList:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}
