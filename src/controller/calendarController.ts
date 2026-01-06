import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../packages/shared/src/types/raceType';
import { Logger } from '../../packages/shared/src/utilities/logger';
import { OldSearchCalendarFilterEntity } from '../repository/entity/filter/oldSearchCalendarFilterEntity';
import { IOldCalendarUseCase } from '../usecase/interface/IOldCalendarUseCase';
import { corsHeaders } from '../utility/cors';
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
        private readonly usecase: IOldCalendarUseCase,
    ) {}

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

            const searchCalendarFilter = new OldSearchCalendarFilterEntity(
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
                { headers: corsHeaders() },
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: corsHeaders(),
                });
            }
            console.error('Error in getCalendarEntityList:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
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
                headers: corsHeaders(),
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                return new Response(`Bad Request: ${error.message}`, {
                    status: error.status,
                    headers: corsHeaders(),
                });
            }
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: corsHeaders(),
            });
        }
    }
}
