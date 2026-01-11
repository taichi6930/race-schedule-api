import 'reflect-metadata';

import type { PlaceDisplayDto } from '@race-schedule/shared/src/dto/placeDisplayDto';
import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import type { SearchPlaceFilterParams } from '../types/searchPlaceFilter';
import type { IPlaceUseCase } from '../usecase/interface/IPlaceUsecase';

@injectable()
export class PlaceController {
    public constructor(
        @inject('PlaceUsecase')
        private readonly usecase: IPlaceUseCase,
    ) {}

    /**
     * 開催場一覧を取得するAPI
     * GET /api/place?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA
     */
    public async getPlaceList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const startDate = searchParams.get('startDate');
            const finishDate = searchParams.get('finishDate');
            const raceTypeListRaw = searchParams.get('raceTypeList');
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
                .filter((v): v is (typeof RaceType)[keyof typeof RaceType] =>
                    Object.values(RaceType).includes(v as any),
                );
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
            const filter: SearchPlaceFilterParams = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
            };
            const data = await this.usecase.fetch(filter);
            // Entity→DTO変換（locationCodeを除外）
            const places: PlaceDisplayDto[] = data.map((e: PlaceEntity) => ({
                placeId: e.placeId,
                raceType: e.raceType,
                datetime: e.datetime,
                placeName: e.placeName,
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
