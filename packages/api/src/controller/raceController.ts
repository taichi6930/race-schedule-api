import 'reflect-metadata';

import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';
import { inject, injectable } from 'tsyringe';

import type { SearchRaceFilterParams } from '../types/searchRaceFilter';
import type { IRaceUsecase } from '../usecase/interface/IRaceUsecase';
import {
    createInternalServerErrorResponse,
    parseLocationList,
    validateDateRange,
    validateRaceTypeList,
    validateRequiredParams,
} from '../utilities/validation';

@injectable()
export class RaceController {
    public constructor(
        @inject('RaceUsecase')
        private readonly usecase: IRaceUsecase,
    ) {}

    /**
     * レース一覧を取得するAPI
     * GET /race?startDate=2026-01-01&finishDate=2026-01-02&raceTypeList=JRA
     */
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

            const filter: SearchRaceFilterParams = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
                locationList,
            };
            const data = await this.usecase.fetch(filter);
            // Entity→DTO変換（locationCodeを除外）
            const races = data
                .filter(
                    (e: RaceEntity) =>
                        !locationList ||
                        (e.locationCode &&
                            locationList.includes(e.locationCode)),
                )
                .map((e: RaceEntity) => ({
                    raceId: e.raceId,
                    placeId: e.placeId,
                    raceType: e.raceType,
                    datetime: e.datetime,
                    placeName: e.placeName,
                    raceNumber: e.raceNumber,
                    placeHeldDays: e.placeHeldDays,
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
            return createInternalServerErrorResponse();
        }
    }
    /**
     * レース情報のupsert API
     * POST /race
     */
    public async upsert(request: Request): Promise<Response> {
        try {
            const body = await request.json();
            if (!Array.isArray(body) || body.length === 0) {
                return Response.json(
                    {
                        error: 'リクエストボディはRaceEntity[]配列（1件以上）である必要があります',
                    },
                    { status: 400 },
                );
            }
            // RaceEntityのバリデーション
            const isValid = body.every(
                (e) =>
                    typeof e.raceId === 'string' &&
                    typeof e.placeId === 'string' &&
                    typeof e.raceType === 'string' &&
                    e.datetime !== undefined &&
                    typeof e.placeName === 'string' &&
                    typeof e.raceNumber === 'number' &&
                    typeof e.placeHeldDays === 'object' &&
                    e.placeHeldDays !== undefined &&
                    e.placeHeldDays.heldTimes !== undefined &&
                    e.placeHeldDays.heldDayTimes !== undefined,
            );
            if (!isValid) {
                return Response.json(
                    { error: '配列内の要素がRaceEntityの形式ではありません' },
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
            console.error('Error in upsertRace:', error);
            return createInternalServerErrorResponse();
        }
    }
}
