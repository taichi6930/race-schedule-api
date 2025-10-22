import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceService } from '../../service/interface/IRaceService';
import { RaceGradeAndStageList } from '../../utility/data/stage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import {
    isIncludedRaceType,
    RACE_TYPE_LIST_ALL,
    RaceType,
} from '../../utility/raceType';
import { GradeType } from '../../utility/validateAndType/gradeType';
import { ICalendarUseCase } from '../interface/ICalendarUseCase';

/**
 * 公営競技のレースカレンダーユースケース
 */
@injectable()
export class CalendarUseCase implements ICalendarUseCase {
    public constructor(
        @inject('CalendarService')
        private readonly calendarService: ICalendarService,
        @inject('RaceService')
        private readonly raceService: IRaceService,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param searchCalendarFilter - カレンダーフィルター情報
     */
    @Logger
    public async fetchCalendarRaceList(
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        calendarDataList.push(
            ...(await this.calendarService.fetchEvents(searchCalendarFilter)),
        );
        return calendarDataList;
    }

    /**
     * カレンダーの更新を行う
     * @param searchCalendarFilter - カレンダーフィルター情報
     * @param displayGradeList - 表示するグレードリスト
     */
    @Logger
    public async updateCalendarRaceData(
        searchCalendarFilter: SearchCalendarFilterEntity,
        displayGradeList: {
            [RaceType.JRA]: GradeType[];
            [RaceType.NAR]: GradeType[];
            [RaceType.OVERSEAS]: GradeType[];
            [RaceType.KEIRIN]: GradeType[];
            [RaceType.AUTORACE]: GradeType[];
            [RaceType.BOATRACE]: GradeType[];
        },
    ): Promise<void> {
        // レース情報を取得する
        const raceEntityList = await this.raceService.fetchRaceEntityList(
            new SearchRaceFilterEntity(
                searchCalendarFilter.startDate,
                searchCalendarFilter.finishDate,
                searchCalendarFilter.raceTypeList,
                [],
                [],
                [],
            ),
            DataLocation.Storage,
        );

        // フラット化して単一の RaceEntity[] にする（後続のオブジェクト型 filteredRaceEntityList と名前衝突しないよう別名）
        const filteredRaceEntityListForHorseRacing: RaceEntity[] = [
            RaceType.JRA,
            RaceType.NAR,
            RaceType.OVERSEAS,
        ].flatMap((raceType) =>
            raceEntityList.filter((raceEntity) => {
                return (
                    isIncludedRaceType(raceEntity.raceData.raceType, [
                        raceType,
                    ]) &&
                    displayGradeList[raceType].includes(
                        raceEntity.raceData.grade,
                    )
                );
            }),
        );
        // KEIRIN/AUTORACE/BOATRACEは、RaceGradeAndStageListからpriorityを取得し6以上で絞る
        const filteredRaceEntityListForMechanicalRacing: RaceEntity[] =
            raceEntityList.filter((raceEntity) => {
                const racePriority =
                    RaceGradeAndStageList.filter(
                        (raceGradeList) =>
                            raceGradeList.raceType ===
                            raceEntity.raceData.raceType,
                    ).find((raceGradeList) => {
                        return (
                            displayGradeList[
                                raceEntity.raceData.raceType
                            ].includes(raceEntity.raceData.grade) &&
                            raceGradeList.grade.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.stage === raceEntity.stage
                        );
                    })?.priority ?? 0;
                return racePriority >= 4;
            });

        const filteredRaceEntityList: RaceEntity[] = [
            ...filteredRaceEntityListForHorseRacing,
            ...filteredRaceEntityListForMechanicalRacing,
        ];

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.fetchEvents(searchCalendarFilter);

        const deleteCalendarDataList = Object.fromEntries(
            RACE_TYPE_LIST_ALL.map((raceType) => [
                raceType,
                calendarDataList.filter(
                    (calendarData: CalendarData) =>
                        isIncludedRaceType(calendarData.raceType, [raceType]) &&
                        !filteredRaceEntityList
                            .filter((raceEntity) =>
                                isIncludedRaceType(
                                    raceEntity.raceData.raceType,
                                    [raceType],
                                ),
                            )
                            .some(
                                (raceEntity: RaceEntity) =>
                                    raceEntity.id === calendarData.id,
                            ),
                ),
            ]),
        );

        await this.calendarService.deleteEventList(
            RACE_TYPE_LIST_ALL.flatMap(
                (raceType) => deleteCalendarDataList[raceType],
            ),
        );

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: RaceEntity[] = RACE_TYPE_LIST_ALL.flatMap(
            (raceType) =>
                filteredRaceEntityList
                    .filter((raceEntity) =>
                        isIncludedRaceType(raceEntity.raceData.raceType, [
                            raceType,
                        ]),
                    )
                    .filter(
                        (raceEntity: RaceEntity) =>
                            !deleteCalendarDataList[
                                raceType as keyof typeof deleteCalendarDataList
                            ].some(
                                (deleteCalendarData: CalendarData) =>
                                    deleteCalendarData.id === raceEntity.id &&
                                    isIncludedRaceType(
                                        deleteCalendarData.raceType,
                                        [raceType],
                                    ),
                            ),
                    ),
        );

        await this.calendarService.upsertEventList(upsertRaceEntityList);
    }
}
