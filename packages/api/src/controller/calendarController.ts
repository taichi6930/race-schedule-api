import 'reflect-metadata';

import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import type { CalendarFilterParams } from '../types/calendar';
import { ICalendarUsecase } from '../usecase/interface/ICalendarUsecase';
import { ErrorHandler, ValidationError } from '../utilities/errorHandler';

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
            const startDate = searchParams.get('startDate');
            const finishDate = searchParams.get('finishDate');
            const raceTypeListRaw = searchParams.get('raceTypeList');
            if (!startDate || !finishDate) {
                throw new ValidationError('startDate, finishDateは必須です');
            }
            if (!raceTypeListRaw) {
                throw new ValidationError('raceTypeListは必須です');
            }
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
            return ErrorHandler.toResponse(error, 'CalendarController.get');
        }
    }
}
