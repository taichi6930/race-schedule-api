import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceGradeAndStageList } from '../../utility/data/common/raceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
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
            jra: GradeType[];
            nar: GradeType[];
            overseas: GradeType[];
            keirin: GradeType[];
            autorace: GradeType[];
            boatrace: GradeType[];
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
            keirin: await this.playerDataService.fetchPlayerDataList(
                RaceType.KEIRIN,
            ),
            autorace: await this.playerDataService.fetchPlayerDataList(
                RaceType.AUTORACE,
            ),
            boatrace: await this.playerDataService.fetchPlayerDataList(
                RaceType.BOATRACE,
            ),
        };

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList = {
            jra: raceEntityList.jra.filter((raceEntity) =>
                displayGradeList.jra.includes(raceEntity.raceData.grade),
            ),
            nar: raceEntityList.nar.filter((raceEntity) =>
                displayGradeList.nar.includes(raceEntity.raceData.grade),
            ),
            overseas: raceEntityList.overseas.filter((raceEntity) =>
                displayGradeList.overseas.includes(raceEntity.raceData.grade),
            ),
            keirin: this.filterRaceEntity(
                RaceType.KEIRIN,
                raceEntityList.keirin,
                displayGradeList.keirin,
                playerList.keirin,
            ).filter((raceEntity) =>
                displayGradeList.keirin.includes(raceEntity.raceData.grade),
            ),
            autorace: this.filterRaceEntity(
                RaceType.AUTORACE,
                raceEntityList.autorace,
                displayGradeList.autorace,
                playerList.autorace,
            ).filter((raceEntity) =>
                displayGradeList.autorace.includes(raceEntity.raceData.grade),
            ),
            boatrace: this.filterRaceEntity(
                RaceType.BOATRACE,
                raceEntityList.boatrace,
                displayGradeList.boatrace,
                playerList.boatrace,
            ).filter((raceEntity) =>
                displayGradeList.boatrace.includes(raceEntity.raceData.grade),
            ),
        };

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.fetchEvents(
                startDate,
                finishDate,
                raceTypeList,
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
            overseas: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.OVERSEAS) {
                    return false;
                }
                return !filteredRaceEntityList.overseas.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            keirin: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.KEIRIN) {
                    return false;
                }
                return !filteredRaceEntityList.keirin.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            autorace: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.AUTORACE) {
                    return false;
                }
                return !filteredRaceEntityList.autorace.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
            boatrace: calendarDataList.filter((calendarData) => {
                if (calendarData.raceType !== RaceType.BOATRACE) {
                    return false;
                }
                return !filteredRaceEntityList.boatrace.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                );
            }),
        };
        await this.calendarService.deleteEvents([
            ...deleteCalendarDataList.jra,
            ...deleteCalendarDataList.nar,
            ...deleteCalendarDataList.overseas,
            ...deleteCalendarDataList.keirin,
            ...deleteCalendarDataList.autorace,
            ...deleteCalendarDataList.boatrace,
        ]);

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList = {
            jra: filteredRaceEntityList.jra.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.jra.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.JRA,
                    ),
            ),
            nar: filteredRaceEntityList.nar.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.nar.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.NAR,
                    ),
            ),
            overseas: filteredRaceEntityList.overseas.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.overseas.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.OVERSEAS,
                    ),
            ),
            keirin: filteredRaceEntityList.keirin.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.keirin.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.KEIRIN,
                    ),
            ),
            autorace: filteredRaceEntityList.autorace.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.autorace.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.AUTORACE,
                    ),
            ),
            boatrace: filteredRaceEntityList.boatrace.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.boatrace.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id &&
                            deleteCalendarData.raceType === RaceType.BOATRACE,
                    ),
            ),
        };
        await this.calendarService.upsertEvents({
            jra: upsertRaceEntityList.jra,
            nar: upsertRaceEntityList.nar,
            overseas: upsertRaceEntityList.overseas,
            mechanicalRacing: [
                ...upsertRaceEntityList.keirin,
                ...upsertRaceEntityList.autorace,
                ...upsertRaceEntityList.boatrace,
            ],
        });
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
        raceEntityList: MechanicalRacingRaceEntity[],
        displayGradeList: GradeType[],
        playerDataList: PlayerData[],
    ): MechanicalRacingRaceEntity[] {
        const filteredRaceEntityList: MechanicalRacingRaceEntity[] =
            raceEntityList.filter((raceEntity) => {
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
            });
        return filteredRaceEntityList;
    }
}
