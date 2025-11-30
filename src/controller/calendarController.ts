import 'reflect-metadata';
import './../utility/format';

import { inject, injectable } from 'tsyringe';

import { SearchCalendarFilterEntity } from '../repository/entity/filter/searchCalendarFilterEntity';
import { ICalendarUseCase } from '../usecase/interface/ICalendarUseCase';
import { Logger } from '../utility/logger';
import { RaceType } from '../utility/raceType';
import { SpecifiedGradeList } from '../utility/validateAndType/gradeType';
import {
    parseBodyToFilter,
    parseSearchDatesAndRaceTypes,
    ValidationError,
} from './requestParser';

@injectable()
export class CalendarController {
    public constructor(
        @inject('CalendarUsecase')
        private readonly usecase: ICalendarUseCase,
    ) {}

    // CORS設定
    private readonly corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    /**
     * 選手データを取得する
     * @param searchParams
     */
    @Logger
    public async getCalendarEntityList(
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const { start, finish, raceTypeList } =
                parseSearchDatesAndRaceTypes(searchParams);

            const searchCalendarFilter = new SearchCalendarFilterEntity(
                start,
                finish,
                raceTypeList,
            );

            const calendarEntityList =
                await this.usecase.fetchCalendarRaceList(searchCalendarFilter);

            return Response.json(
                {
                    count: calendarEntityList.length,
                    races: calendarEntityList,
                },
                { headers: this.corsHeaders },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: this.corsHeaders,
                });
            }
            console.error('Error in getCalendarEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
    /**
     * レースデータを登録・更新する
     * @param request - Requestオブジェクト
     */
    @Logger
    public async postUpsertCalendar(request: Request): Promise<Response> {
        try {
            const body: unknown = await request.json();
            const searchCalendarFilter = parseBodyToFilter(body);

            await this.usecase.updateCalendarRaceData(searchCalendarFilter, {
                [RaceType.JRA]: SpecifiedGradeList(RaceType.JRA),
                [RaceType.NAR]: SpecifiedGradeList(RaceType.NAR),
                [RaceType.OVERSEAS]: SpecifiedGradeList(RaceType.OVERSEAS),
                [RaceType.KEIRIN]: SpecifiedGradeList(RaceType.KEIRIN),
                [RaceType.AUTORACE]: SpecifiedGradeList(RaceType.AUTORACE),
                [RaceType.BOATRACE]: SpecifiedGradeList(RaceType.BOATRACE),
            });

            return new Response('OK', {
                status: 200,
                headers: this.corsHeaders,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: this.corsHeaders,
                });
            }
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
