import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarFilterParams } from '../types/calendar';
import { ICalendarUsecase } from '../usecase/interface/ICalendarUsecase';
import {
    createInternalServerErrorResponse,
    validateDateRange,
    validateRaceTypeList,
    validateRequiredParams,
} from '../utilities/validation';

@injectable()
export class CalendarController {
    public constructor(
        @inject('CalendarUsecase')
        private readonly usecase: ICalendarUsecase,
    ) {}

    /**
     * カレンダー一覧を取得する
     * query param: startDate, finishDate, raceTypeList (カンマ区切り)
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
            const filter: CalendarFilterParams = {
                startDate: startDateObj,
                finishDate: finishDateObj,
                raceTypeList,
            };
            const data = await this.usecase.fetch(filter);
            return Response.json(
                {
                    count: data.length,
                    calendars: data,
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
        } catch (error) {
            console.error('Error in getCalendarList:', error);
            return createInternalServerErrorResponse();
        }
    }
}
