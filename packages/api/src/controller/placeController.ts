import 'reflect-metadata';

import type { PlaceDisplayDto } from '@race-schedule/shared/src/dto/placeDisplayDto';
import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { inject, injectable } from 'tsyringe';

import type { SearchPlaceFilterParams } from '../types/searchPlaceFilter';
import type { IPlaceUsecase } from '../usecase/interface/IPlaceUsecase';
import { ErrorHandler, ValidationError } from '../utilities/errorHandler';

@injectable()
export class PlaceController {
    public constructor(
        @inject('PlaceUsecase')
        private readonly usecase: IPlaceUsecase,
    ) {}

    /**
     * 開催場一覧を取得するAPI
     * GET /place?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA
     */
    @Logger
    public async get(searchParams: URLSearchParams): Promise<Response> {
        try {
            const startDate = searchParams.get('startDate');
            const finishDate = searchParams.get('finishDate');
            const raceTypeListRaw = searchParams.get('raceTypeList');
            const locationListRaw = searchParams.get('locationList');
            const isDisplayPlaceHeldDaysRaw = searchParams.get(
                'isDisplayPlaceHeldDays',
            );
            const isDisplayPlaceGradeRaw = searchParams.get(
                'isDisplayPlaceGrade',
            );

            // 必須パラメータチェック
            if (!startDate || !finishDate) {
                throw new ValidationError('startDate, finishDateは必須です');
            }
            if (!raceTypeListRaw) {
                throw new ValidationError('raceTypeListは必須です');
            }

            // raceTypeListの妥当性チェック
            const raceTypeList = raceTypeListRaw
                .split(',')
                .filter((v): v is (typeof RaceType)[keyof typeof RaceType] =>
                    Object.values(RaceType).includes(v as any),
                );
            if (raceTypeList.length === 0) {
                throw new ValidationError('raceTypeListに有効な値がありません');
            }

            // 日付の妥当性チェック
            const startDateObj = new Date(startDate);
            const finishDateObj = new Date(finishDate);
            if (
                Number.isNaN(startDateObj.getTime()) ||
                Number.isNaN(finishDateObj.getTime())
            ) {
                throw new ValidationError(
                    'startDate, finishDateは有効な日付文字列で指定してください',
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

            const filter: SearchPlaceFilterParams = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
                locationList,
                isDisplayPlaceHeldDays:
                    isDisplayPlaceHeldDaysRaw === null
                        ? undefined
                        : isDisplayPlaceHeldDaysRaw === 'true',
                isDisplayPlaceGrade:
                    isDisplayPlaceGradeRaw === null
                        ? undefined
                        : isDisplayPlaceGradeRaw === 'true',
            };
            const data = await this.usecase.fetch(filter);
            // Entity→DTO変換（locationCodeを除外）
            const places: PlaceDisplayDto[] = data
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
                    locationName: (e as any).locationName ?? e.placeName,
                    placeGrade: (e as any).placeGrade,
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
            return ErrorHandler.toResponse(error, 'PlaceController.get');
        }
    }

    /**
     * 開催場情報のupsert API
     * POST /place
     */
    public async upsert(request: Request): Promise<Response> {
        try {
            const body = await request.json();
            if (!Array.isArray(body) || body.length === 0) {
                throw new ValidationError(
                    'リクエストボディはPlaceEntity[]配列（1件以上）である必要があります',
                );
            }
            // PlaceEntityのバリデーション
            const isValid = body.every(
                (e) =>
                    typeof e.placeId === 'string' &&
                    typeof e.raceType === 'string' &&
                    e.datetime !== undefined &&
                    typeof e.placeName === 'string' &&
                    typeof e.placeHeldDays === 'object' &&
                    e.placeHeldDays !== undefined &&
                    e.placeHeldDays.heldTimes !== undefined &&
                    e.placeHeldDays.heldDayTimes !== undefined,
            );
            if (!isValid) {
                throw new ValidationError(
                    '配列内の要素がPlaceEntityの形式ではありません',
                );
            }
            // 日付型変換
            const entityList = body.map((e) => ({
                ...e,
                datetime: new Date(e.datetime),
            }));
            const result = await this.usecase.upsert(entityList);
            return Response.json(result, { status: 200 });
        } catch (error) {
            return ErrorHandler.toResponse(error, 'PlaceController.upsert');
        }
    }
}
