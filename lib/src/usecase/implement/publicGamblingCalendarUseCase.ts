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
            ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
            DataLocation.Storage,
        );

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList = {
            jra: raceEntityList.jra.filter((raceEntity) =>
                displayGradeList.jra.includes(raceEntity.raceData.grade),
            ),
            nar: raceEntityList.nar.filter((raceEntity) =>
                displayGradeList.nar.includes(raceEntity.raceData.grade),
            ),
            world: raceEntityList.world.filter((raceEntity) =>
                displayGradeList.world.includes(raceEntity.raceData.grade),
            ),
            keirin: raceEntityList.keirin.filter((raceEntity) =>
                displayGradeList.keirin.includes(raceEntity.raceData.grade),
            ),
            boatrace: raceEntityList.boatrace.filter((raceEntity) =>
                displayGradeList.boatrace.includes(raceEntity.raceData.grade),
            ),
            autorace: raceEntityList.autorace.filter((raceEntity) =>
                displayGradeList.autorace.includes(raceEntity.raceData.grade),
            ),
        };
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['jra', 'nar', 'world', 'keirin', 'boatrace', 'autorace'],
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
            nar: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.nar.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.NAR,
                    ),
            ),
            world: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.world.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.WORLD,
                    ),
            ),
            keirin: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.keirin.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.KEIRIN,
                    ),
            ),
            boatrace: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.boatrace.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.BOATRACE,
                    ),
            ),
            autorace: calendarDataList.filter(
                (calendarData) =>
                    !filteredRaceEntityList.autorace.some(
                        (raceEntity) =>
                            raceEntity.id === calendarData.id &&
                            calendarData.raceType === RaceType.AUTORACE,
                    ),
            ),
        };
        await this.publicGamblingCalendarService.deleteEvents({
            jra: deleteCalendarDataList.jra,
            nar: deleteCalendarDataList.nar,
            world: deleteCalendarDataList.world,
            keirin: deleteCalendarDataList.keirin,
            boatrace: deleteCalendarDataList.boatrace,
            autorace: deleteCalendarDataList.autorace,
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
            nar: filteredRaceEntityList.nar.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.nar.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
            world: filteredRaceEntityList.world.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.world.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
            keirin: filteredRaceEntityList.keirin.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.keirin.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
            boatrace: filteredRaceEntityList.boatrace.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.boatrace.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
            autorace: filteredRaceEntityList.autorace.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.autorace.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            ),
        };
        await this.publicGamblingCalendarService.upsertEvents({
            jra: upsertRaceEntityList.jra,
            nar: upsertRaceEntityList.nar,
            world: upsertRaceEntityList.world,
            keirin: upsertRaceEntityList.keirin,
            boatrace: upsertRaceEntityList.boatrace,
            autorace: upsertRaceEntityList.autorace,
        });
    }
}
