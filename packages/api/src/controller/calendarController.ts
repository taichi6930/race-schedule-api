import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarFilterParams } from '../types/calendar';
import { ICalendarUsecase } from '../usecase/interface/ICalendarUsecase';
import { parseRaceTypeList } from '../utilities/typeGuards';

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
            const raceTypeList = parseRaceTypeList(raceTypeListRaw.split(','));
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
            return new Response('Internal Server Error', { status: 500 });
        }
    }
}
