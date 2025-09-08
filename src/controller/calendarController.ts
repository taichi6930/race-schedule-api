import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { SpecifiedGradeList } from '../../lib/src/utility/validateAndType/gradeType';
import { SearchCalendarFilterEntity } from '../repository/entity/searchCalendarFilterEntity';
import { SearchRaceFilterEntity } from '../repository/entity/searchRaceFilterEntity';
import { ICalendarUseCase } from '../usecase/interface/ICalendarUseCase';
import { CommonParameter } from '../utility/commonParameter';
import { Logger } from '../utility/logger';
import { convertRaceTypeList, RaceType } from '../utility/raceType';

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
     * @param commonParameter - 共通パラメータ
     */
    @Logger
    public async getCalendarEntityList(
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const raceTypeParam =
                commonParameter.searchParams.getAll('raceType');
            const startDateParam =
                commonParameter.searchParams.get('startDate');
            const finishDateParam =
                commonParameter.searchParams.get('finishDate');

            const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);

            if (raceTypeList.length === 0) {
                return new Response('Bad Request: Invalid raceType', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            // startDateとfinishDateのバリデーションも行う
            if (
                (startDateParam &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(startDateParam)) ||
                !startDateParam
            ) {
                return new Response('Bad Request: Invalid startDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            if (
                (finishDateParam &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(finishDateParam)) ||
                !finishDateParam
            ) {
                return new Response('Bad Request: Invalid finishDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            const searchCalendarFilter = new SearchCalendarFilterEntity(
                new Date(startDateParam),
                new Date(finishDateParam),
                raceTypeList,
            );

            const raceEntityList = await this.usecase.fetchCalendarRaceList(
                commonParameter,
                searchCalendarFilter,
            );

            return Response.json(
                {
                    count: raceEntityList.length,
                    races: raceEntityList,
                },
                { headers: this.corsHeaders },
            );
        } catch (error) {
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
     * @param commonParameter - 共通パラメータ
     */
    @Logger
    public async postUpsertCalendar(
        request: Request,
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const body: any = await request.json();
            if (
                !body ||
                typeof body.raceType !== 'string' ||
                typeof body.startDate !== 'string' ||
                typeof body.finishDate !== 'string'
            ) {
                return new Response('Bad Request: body is missing or invalid', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            const { raceType, startDate, finishDate } = body;

            // raceTypeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                return new Response('Bad Request: Invalid raceType', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
                return new Response('Bad Request: Invalid startDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            if (!/^\d{4}-\d{2}-\d{2}$/.test(finishDate)) {
                return new Response('Bad Request: Invalid finishDate', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            const searchRaceFilter = new SearchRaceFilterEntity(
                new Date(startDate),
                new Date(finishDate),
                raceTypeList,
            );

            await this.usecase.updateCalendarRaceData(
                commonParameter,
                searchRaceFilter,
                {
                    [RaceType.JRA]: SpecifiedGradeList(RaceType.JRA),
                    [RaceType.NAR]: SpecifiedGradeList(RaceType.NAR),
                    [RaceType.OVERSEAS]: SpecifiedGradeList(RaceType.OVERSEAS),
                    [RaceType.KEIRIN]: SpecifiedGradeList(RaceType.KEIRIN),
                    [RaceType.AUTORACE]: SpecifiedGradeList(RaceType.AUTORACE),
                    [RaceType.BOATRACE]: SpecifiedGradeList(RaceType.BOATRACE),
                },
            );

            return new Response('OK', {
                status: 200,
                headers: this.corsHeaders,
            });
        } catch (error) {
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
