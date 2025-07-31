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
            ['jra', 'nar', 'world', 'keirin', 'autorace', 'boatrace'],
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
            // keirin: raceEntityList.keirin.filter((raceEntity) =>
            //     displayGradeList.keirin.includes(raceEntity.raceData.grade),
            // ),
            // autorace: raceEntityList.autorace.filter((raceEntity) =>
            //     displayGradeList.autorace.includes(raceEntity.raceData.grade),
            // ),
            // boatrace: raceEntityList.boatrace.filter((raceEntity) =>
            //     displayGradeList.boatrace.includes(raceEntity.raceData.grade),
            // ),
        };
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['jra', 'nar', 'world', 'keirin', 'autorace', 'boatrace'],
            );

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList = {
            jra: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.JRA) {
                    return false;
                }
                return !filteredRaceEntityList.jra.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            nar: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.NAR) {
                    return false;
                }
                return !filteredRaceEntityList.nar.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            world: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.WORLD) {
                    return false;
                }
                return !filteredRaceEntityList.world.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            // keirin: calendarDataList.filter((calendarData) => {
            //     if (calendarData.raceType !== RaceType.KEIRIN) {
            //         return false;
            //     }
            //     return !filteredRaceEntityList.keirin.some(
            //         (raceEntity) => raceEntity.id === calendarData.id,
            //     );
            // }),
            // autorace: calendarDataList.filter((calendarData) => {
            //     if (calendarData.raceType !== RaceType.AUTORACE) {
            //         return false;
            //     }
            //     return !filteredRaceEntityList.autorace.some(
            //         (raceEntity) => raceEntity.id === calendarData.id,
            //     );
            // }),
            // boatrace: calendarDataList.filter((calendarData) => {
            //     if (calendarData.raceType !== RaceType.BOATRACE) {
            //         return false;
            //     }
            //     return !filteredRaceEntityList.boatrace.some(
            //         (raceEntity) => raceEntity.id === calendarData.id,
            //     );
            // }),
        };
        await this.publicGamblingCalendarService.deleteEvents({
            jra: deleteCalendarDataList.jra,
            nar: deleteCalendarDataList.nar,
            world: deleteCalendarDataList.world,
            // keirin: deleteCalendarDataList.keirin,
            // autorace: deleteCalendarDataList.autorace,
            // boatrace: deleteCalendarDataList.boatrace,
        });

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList = {
            jra: filteredRaceEntityList.jra.filter((raceEntity) => {
                return !deleteCalendarDataList.jra.some(
                    (deleteCalendarData) =>
                        deleteCalendarData.id === raceEntity.id,
                );
            }),
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
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.WORLD,
                    ),
            ),
            // keirin: filteredRaceEntityList.keirin.filter(
            //     (raceEntity) =>
            //         !deleteCalendarDataList.keirin.some(
            //             (deleteCalendarData) =>
            //                 deleteCalendarData.id === raceEntity.id &&
            //                 deleteCalendarData.raceType === RaceType.KEIRIN,
            //         ),
            // ),
            // autorace: filteredRaceEntityList.autorace.filter(
            //     (raceEntity) =>
            //         !deleteCalendarDataList.autorace.some(
            //             (deleteCalendarData) =>
            //                 deleteCalendarData.id === raceEntity.id &&
            //                 deleteCalendarData.raceType === RaceType.AUTORACE,
            //         ),
            // ),
            // boatrace: filteredRaceEntityList.boatrace.filter(
            //     (raceEntity) =>
            //         !deleteCalendarDataList.boatrace.some(
            //             (deleteCalendarData) =>
            //                 deleteCalendarData.id === raceEntity.id &&
            //                 deleteCalendarData.raceType === RaceType.BOATRACE,
            //         ),
            // ),
        };
        await this.publicGamblingCalendarService.upsertEvents({
            jra: upsertRaceEntityList.jra,
            nar: upsertRaceEntityList.nar,
            world: upsertRaceEntityList.world,
        });
    }
}
