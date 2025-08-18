import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceGradeAndStageList } from '../../utility/data/common/raceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { ALL_RACE_TYPE_LIST, RaceType } from '../../utility/raceType';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * 公営競技のレースカレンダーユースケース
 */
@injectable()
export class PublicGamblingCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('PublicGamblingCalendarService')
        private readonly calendarService: ICalendarService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerDataService,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async fetchRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        calendarDataList.push(
            ...(await this.calendarService.fetchEvents(
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
     * @param raceTypeList - レース種別のリスト
     * @param displayGradeList
     * @param displayGradeList.jra
     * @param displayGradeList.nar
     * @param displayGradeList.overseas
     * @param displayGradeList.keirin
     * @param displayGradeList.autorace
     * @param displayGradeList.boatrace
     */
    @Logger
    public async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
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
        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );

        const playerList = {
            [RaceType.KEIRIN]: await this.playerDataService.fetchPlayerDataList(
                RaceType.KEIRIN,
            ),
            [RaceType.AUTORACE]:
                await this.playerDataService.fetchPlayerDataList(
                    RaceType.AUTORACE,
                ),
            [RaceType.BOATRACE]:
                await this.playerDataService.fetchPlayerDataList(
                    RaceType.BOATRACE,
                ),
        };

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList = {
            [RaceType.JRA]: raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.raceType === RaceType.JRA &&
                    displayGradeList[RaceType.JRA].includes(
                        raceEntity.raceData.grade,
                    ),
            ),
            [RaceType.NAR]: raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.raceType === RaceType.NAR &&
                    displayGradeList[RaceType.NAR].includes(
                        raceEntity.raceData.grade,
                    ),
            ),
            [RaceType.OVERSEAS]: raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.raceType === RaceType.OVERSEAS &&
                    displayGradeList[RaceType.OVERSEAS].includes(
                        raceEntity.raceData.grade,
                    ),
            ),
            [RaceType.KEIRIN]: this.filterRaceEntity(
                RaceType.KEIRIN,
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.KEIRIN,
                ),
                displayGradeList[RaceType.KEIRIN],
                playerList[RaceType.KEIRIN],
            ).filter((raceEntity) =>
                displayGradeList[RaceType.KEIRIN].includes(
                    raceEntity.raceData.grade,
                ),
            ),
            [RaceType.AUTORACE]: this.filterRaceEntity(
                RaceType.AUTORACE,
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.AUTORACE,
                ),
                displayGradeList[RaceType.AUTORACE],
                playerList[RaceType.AUTORACE],
            ).filter((raceEntity) =>
                displayGradeList[RaceType.AUTORACE].includes(
                    raceEntity.raceData.grade,
                ),
            ),
            [RaceType.BOATRACE]: this.filterRaceEntity(
                RaceType.BOATRACE,
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.BOATRACE,
                ),
                displayGradeList[RaceType.BOATRACE],
                playerList[RaceType.BOATRACE],
            ).filter((raceEntity) =>
                displayGradeList[RaceType.BOATRACE].includes(
                    raceEntity.raceData.grade,
                ),
            ),
        };

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.fetchEvents(
                startDate,
                finishDate,
                raceTypeList,
            );

        const deleteCalendarDataList = Object.fromEntries(
            ALL_RACE_TYPE_LIST.map((raceType) => [
                raceType,
                calendarDataList.filter(
                    (calendarData: CalendarData) =>
                        calendarData.raceType === raceType &&
                        !filteredRaceEntityList[
                            raceType as keyof typeof filteredRaceEntityList
                        ].some(
                            (raceEntity: RaceEntity) =>
                                raceEntity.id === calendarData.id,
                        ),
                ),
            ]),
        );

        await this.calendarService.deleteEvents(
            ALL_RACE_TYPE_LIST.flatMap(
                (raceType) => deleteCalendarDataList[raceType],
            ),
        );

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: RaceEntity[] = ALL_RACE_TYPE_LIST.flatMap(
            (raceType) =>
                filteredRaceEntityList[
                    raceType as keyof typeof filteredRaceEntityList
                ].filter(
                    (raceEntity: RaceEntity) =>
                        !deleteCalendarDataList[
                            raceType as keyof typeof deleteCalendarDataList
                        ].some(
                            (deleteCalendarData: CalendarData) =>
                                deleteCalendarData.id === raceEntity.id &&
                                deleteCalendarData.raceType === raceType,
                        ),
                ),
        );

        await this.calendarService.upsertEvents(upsertRaceEntityList);
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データが存在するかを確認する
     * @param raceType
     * @param raceEntityList
     * @param displayGradeList
     * @param playerDataList
     */
    private filterRaceEntity(
        raceType: RaceType,
        raceEntityList: RaceEntity[],
        displayGradeList: GradeType[],
        playerDataList: PlayerData[],
    ): RaceEntity[] {
        const filteredRaceEntityList: RaceEntity[] = raceEntityList.filter(
            (raceEntity) => {
                const maxPlayerPriority = raceEntity.racePlayerDataList.reduce(
                    (maxPriority, playerData) => {
                        const playerPriority =
                            playerDataList.find(
                                (player) =>
                                    playerData.playerNumber ===
                                    player.playerNumber,
                            )?.priority ?? 0;
                        return Math.max(maxPriority, playerPriority);
                    },
                    0,
                );

                const racePriority: number =
                    RaceGradeAndStageList.filter(
                        (raceGradeList) => raceGradeList.raceType === raceType,
                    ).find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.stage === raceEntity.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            },
        );
        return filteredRaceEntityList;
    }
}
