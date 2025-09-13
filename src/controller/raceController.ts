import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { SearchRaceFilterEntity } from '../repository/entity/filter/searchRaceFilterEntity';
import { IRaceUseCase } from '../usecase/interface/IRaceUsecase';
import { CommonParameter } from '../utility/commonParameter';
import { Logger } from '../utility/logger';
import { convertRaceTypeList, RaceType } from '../utility/raceType';

@injectable()
export class RaceController {
    public constructor(
        @inject('RaceUsecase')
        private readonly usecase: IRaceUseCase,
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
     * @param searchParams
     */
    @Logger
    public async getRaceEntityList(
        commonParameter: CommonParameter,
        searchParams: URLSearchParams,
    ): Promise<Response> {
        try {
            const raceTypeParam = searchParams.getAll('raceType');
            const gradeParam = searchParams.getAll('grade');
            const stageParam = searchParams.getAll('stage');
            const locationParam = searchParams.getAll('location');
            const startDateParam = searchParams.get('startDate');
            const finishDateParam = searchParams.get('finishDate');

            const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);

            // gradeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const gradeList =
                (typeof gradeParam === 'string'
                    ? [gradeParam]
                    : typeof gradeParam === 'object'
                      ? Array.isArray(gradeParam)
                          ? gradeParam.map((g: string) => g)
                          : undefined
                      : undefined) ?? [];

            const locationList =
                (typeof locationParam === 'string'
                    ? [locationParam]
                    : typeof locationParam === 'object'
                      ? Array.isArray(locationParam)
                          ? locationParam.map((l: string) => l)
                          : undefined
                      : undefined) ?? [];

            const stageList =
                (typeof stageParam === 'string'
                    ? [stageParam]
                    : typeof stageParam === 'object'
                      ? Array.isArray(stageParam)
                          ? stageParam.map((s: string) => s)
                          : undefined
                      : undefined) ?? [];

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
            const searchRaceFilter = new SearchRaceFilterEntity(
                new Date(startDateParam),
                new Date(finishDateParam),
                raceTypeList,
                locationList,
                gradeList,
                stageList,
            );

            const raceEntityList = await this.usecase.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
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
    public async postUpsertRace(
        request: Request,
        commonParameter: CommonParameter,
    ): Promise<Response> {
        try {
            const body: any = await request.json();
            if (
                !body ||
                (typeof body.raceType !== 'string' &&
                    !Array.isArray(body.raceType)) ||
                typeof body.startDate !== 'string' ||
                typeof body.finishDate !== 'string'
            ) {
                console.log('Bad Request: body is missing or invalid', body);
                return new Response('Bad Request: body is missing or invalid', {
                    status: 400,
                    headers: this.corsHeaders,
                });
            }
            const { raceType, startDate, finishDate, location, grade, stage } =
                body;

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
            const locationList =
                (typeof location === 'string'
                    ? [location]
                    : typeof location === 'object'
                      ? Array.isArray(location)
                          ? (location as string[]).map((r: string) => r)
                          : undefined
                      : undefined) ?? [];

            const gradeList =
                (typeof grade === 'string'
                    ? [grade]
                    : typeof grade === 'object'
                      ? Array.isArray(grade)
                          ? (grade as string[]).map((r: string) => r)
                          : undefined
                      : undefined) ?? [];

            const stageList =
                (typeof stage === 'string'
                    ? [stage]
                    : typeof stage === 'object'
                      ? Array.isArray(stage)
                          ? (stage as string[]).map((r: string) => r)
                          : undefined
                      : undefined) ?? [];

            const searchRaceFilter = new SearchRaceFilterEntity(
                new Date(startDate),
                new Date(finishDate),
                raceTypeList,
                locationList,
                gradeList,
                stageList,
            );

            const upsertResult = await this.usecase.upsertRaceEntityList(
                commonParameter,
                searchRaceFilter,
            );

            return Response.json(
                {
                    message: 'Upsert completed',
                    successCount: upsertResult.successCount,
                    failureCount: upsertResult.failureCount,
                    failures: upsertResult.failures,
                },
                { headers: this.corsHeaders },
            );
        } catch (error) {
            console.error('Error in postUpsertRace:', error);
            return new Response('Internal Server Error', {
                status: 500,
                headers: this.corsHeaders,
            });
        }
    }
}
