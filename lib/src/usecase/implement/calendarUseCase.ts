import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerService } from '../../service/interface/IPlayerService';
import { IRaceService } from '../../service/interface/IRaceService';
import { RaceGradeAndStageList } from '../../utility/data/stage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    RaceType,
} from '../../utility/raceType';
import { GradeType } from '../../utility/validateAndType/gradeType';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * 公営競技のレースカレンダーユースケース
 */
@injectable()
export class CalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('CalendarService')
        private readonly calendarService: ICalendarService,
        @inject('RaceService')
        private readonly raceService: IRaceService,
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerService,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     */
    @Logger
    public async fetchCalendarRaceList(
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
     * @param raceTypeList
     * @param displayGradeList
     */
    @Logger
    public async updateCalendarRaceData(
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
        const raceEntityList = await this.raceService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );

        // 取得対象の公営競技種別を配列で定義し、並列で選手データを取得してオブジェクト化する
        const playerList: {
            [RaceType.KEIRIN]: PlayerData[];
            [RaceType.AUTORACE]: PlayerData[];
            [RaceType.BOATRACE]: PlayerData[];
        } = Object.fromEntries(
            await Promise.all(
                RACE_TYPE_LIST_MECHANICAL_RACING.map(async (raceType) => [
                    raceType,
                    await this.playerDataService.fetchPlayerDataList(raceType),
                ]),
            ),
        );

        // フラット化して単一の RaceEntity[] にする（後続のオブジェクト型 filteredRaceEntityList と名前衝突しないよう別名）
        const filteredRaceEntityList: RaceEntity[] = [
            ...RACE_TYPE_LIST_HORSE_RACING.flatMap((raceType) =>
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === raceType &&
                        displayGradeList[raceType].includes(
                            raceEntity.raceData.grade,
                        ),
                ),
            ),
            ...RACE_TYPE_LIST_MECHANICAL_RACING.flatMap((raceType) =>
                this.filterRaceEntity(
                    raceType,
                    raceEntityList.filter(
                        (raceEntity) =>
                            raceEntity.raceData.raceType === raceType,
                    ),
                    displayGradeList[raceType],
                    playerList[raceType],
                ).filter((raceEntity) =>
                    displayGradeList[raceType].includes(
                        raceEntity.raceData.grade,
                    ),
                ),
            ),
        ];

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.fetchEvents(
                startDate,
                finishDate,
                raceTypeList,
            );

        const deleteCalendarDataList = Object.fromEntries(
            RACE_TYPE_LIST_ALL.map((raceType) => [
                raceType,
                calendarDataList.filter(
                    (calendarData: CalendarData) =>
                        calendarData.raceType === raceType &&
                        !filteredRaceEntityList
                            .filter(
                                (raceEntity) =>
                                    raceEntity.raceData.raceType === raceType,
                            )
                            .some(
                                (raceEntity: RaceEntity) =>
                                    raceEntity.id === calendarData.id,
                            ),
                ),
            ]),
        );

        await this.calendarService.deleteEvents(
            RACE_TYPE_LIST_ALL.flatMap(
                (raceType) => deleteCalendarDataList[raceType],
            ),
        );

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: RaceEntity[] = RACE_TYPE_LIST_ALL.flatMap(
            (raceType) =>
                filteredRaceEntityList
                    .filter(
                        (raceEntity) =>
                            raceEntity.raceData.raceType === raceType,
                    )
                    .filter(
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
