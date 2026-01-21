import 'reflect-metadata';

import type { PlaceDisplayDto } from '@race-schedule/shared/src/dto/placeDisplayDto';
import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { inject, injectable } from 'tsyringe';

import type { SearchPlaceFilterParams } from '../types/searchPlaceFilter';
import type { IPlaceUsecase } from '../usecase/interface/IPlaceUsecase';
import {
    createErrorResponse,
    createInternalServerErrorResponse,
    parseLocationList,
    validateDateRange,
    validateRaceTypeList,
    validateRequiredParams,
} from '../utilities/validation';

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
            // 必須パラメータチェック
            const requiredResult = validateRequiredParams(searchParams, [
                'startDate',
                'finishDate',
                'raceTypeList',
            ]);
            if (!requiredResult.success) {
                return requiredResult.error;
            }

            const { startDate, finishDate, raceTypeList: raceTypeListRaw } = requiredResult.value;

            // raceTypeListの妥当性チェック
            const raceTypeResult = validateRaceTypeList(raceTypeListRaw);
            if (!raceTypeResult.success) {
                return raceTypeResult.error;
            }
            const raceTypeList = raceTypeResult.value;

            // 日付の妥当性チェック
            const dateResult = validateDateRange(startDate, finishDate);
            if (!dateResult.success) {
                return dateResult.error;
            }
            const { startDate: startDateObj, finishDate: finishDateObj } = dateResult.value;

            // locationList（カンマ区切り or undefined）
            const locationListRaw = searchParams.get('locationList');
            const locationList = parseLocationList(locationListRaw);

            const isDisplayPlaceHeldDaysRaw = searchParams.get('isDisplayPlaceHeldDays');
            const isDisplayPlaceGradeRaw = searchParams.get('isDisplayPlaceGrade');

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
            console.error('Error in getPlaceList:', error);
            return createInternalServerErrorResponse();
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
                return Response.json(
                    {
                        error: 'リクエストボディはPlaceEntity[]配列（1件以上）である必要があります',
                    },
                    { status: 400 },
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
                return Response.json(
                    { error: '配列内の要素がPlaceEntityの形式ではありません' },
                    { status: 400 },
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
            console.error('Error in upsertPlace:', error);
            return createInternalServerErrorResponse();
        }
    }
}
