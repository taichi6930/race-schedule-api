import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/base';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/sqlite';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * 公営競技のレースカレンダーユースケース
 */
@injectable()
export class PublicGamblingCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('PublicGamblingCalendarService')
        private readonly publicGamblingCalendarService: ICalendarService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @param raceTypeList
     */
    @Logger
    public async fetchRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        calendarDataList.push(
            ...(await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                raceTypeList,
            )),
        );
        return calendarDataList;
    }

    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     * @param displayGradeList.jra
     * @param displayGradeList.nar
     * @param displayGradeList.world
     * @param displayGradeList.keirin
     * @param displayGradeList.autorace
     * @param displayGradeList.boatrace
     */
    @Logger
    public async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: {
            jra: GradeType[];
            nar: GradeType[];
            world: GradeType[];
            keirin: GradeType[];
            autorace: GradeType[];
            boatrace: GradeType[];
        },
    ): Promise<void> {
        // レース情報を取得する
        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['jra'],
            DataLocation.Storage,
        );

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList = {
            jra: raceEntityList.jra.filter((raceEntity) =>
                displayGradeList.jra.includes(raceEntity.raceData.grade),
            ),
        };
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['jra'],
            );

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList = {
            jra: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.jra.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.JRA,
                    ),
            ),
        };
        await this.publicGamblingCalendarService.deleteEvents({
            nar: [],
            jra: deleteCalendarDataList.jra,
            world: [],
            keirin: [],
            boatrace: [],
            autorace: [],
        });

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList = {
            jra: filteredRaceEntityList.jra.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.jra.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
        };
        await this.publicGamblingCalendarService.upsertEvents({
            jra: upsertRaceEntityList.jra,
        });
    }
}
