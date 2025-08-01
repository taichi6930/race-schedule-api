import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { AutoraceSpecifiedGradeAndStageList } from '../../utility/data/autorace/autoraceRaceStage';
import { GradeType } from '../../utility/data/base';
import { BoatraceSpecifiedGradeAndStageList } from '../../utility/data/boatrace/boatraceRaceStage';
import { BoatraceGradeType } from '../../utility/data/common/gradeType';
import { AutoraceGradeType } from '../../utility/data/common/gradeType';
import { KeirinGradeType } from '../../utility/data/common/gradeType';
import { KeirinRaceGradeAndStageList } from '../../utility/data/keirin/keirinRaceStage';
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
        private readonly publicGamblingCalendarService: ICalendarService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerDataService,
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
            world: raceEntityList.world.filter((raceEntity) =>
                displayGradeList.world.includes(raceEntity.raceData.grade),
            ),
            keirin: this.filterRaceEntityForKeirin(
                raceEntityList.keirin,
                displayGradeList.keirin,
                playerList.keirin,
            ).filter((raceEntity) =>
                displayGradeList.keirin.includes(raceEntity.raceData.grade),
            ),
            autorace: this.filterRaceEntityForAutorace(
                raceEntityList.autorace,
                displayGradeList.autorace,
                playerList.autorace,
            ).filter((raceEntity) =>
                displayGradeList.autorace.includes(raceEntity.raceData.grade),
            ),
            boatrace: this.filterRaceEntityForBoatrace(
                raceEntityList.boatrace,
                displayGradeList.boatrace,
                playerList.boatrace,
            ).filter((raceEntity) =>
                displayGradeList.boatrace.includes(raceEntity.raceData.grade),
            ),
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
        await this.publicGamblingCalendarService.deleteEvents({
            jra: deleteCalendarDataList.jra,
            nar: deleteCalendarDataList.nar,
            world: deleteCalendarDataList.world,
            keirin: deleteCalendarDataList.keirin,
            autorace: deleteCalendarDataList.autorace,
            boatrace: deleteCalendarDataList.boatrace,
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
        await this.publicGamblingCalendarService.upsertEvents({
            jra: upsertRaceEntityList.jra,
            nar: upsertRaceEntityList.nar,
            world: upsertRaceEntityList.world,
            keirin: upsertRaceEntityList.keirin,
            autorace: upsertRaceEntityList.autorace,
            boatrace: upsertRaceEntityList.boatrace,
        });
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データが存在するかを確認する
     * @param raceEntityList
     * @param displayGradeList
     * @param playerDataList
     */
    private filterRaceEntityForKeirin(
        raceEntityList: KeirinRaceEntity[],
        displayGradeList: KeirinGradeType[],
        playerDataList: PlayerData[],
    ): KeirinRaceEntity[] {
        const filteredRaceEntityList: KeirinRaceEntity[] =
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
                    KeirinRaceGradeAndStageList.filter(
                        (raceGradeList) =>
                            raceGradeList.raceType === RaceType.KEIRIN,
                    ).find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.stage === raceEntity.raceData.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データが存在するかを確認する
     * @param raceEntityList
     * @param displayGradeList
     * @param playerDataList
     */
    private filterRaceEntityForAutorace(
        raceEntityList: AutoraceRaceEntity[],
        displayGradeList: AutoraceGradeType[],
        playerDataList: PlayerData[],
    ): AutoraceRaceEntity[] {
        const filteredRaceEntityList: AutoraceRaceEntity[] =
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
                    AutoraceSpecifiedGradeAndStageList.find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade === raceEntity.raceData.grade &&
                            raceGradeList.stage === raceEntity.raceData.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データが存在するかを確認する
     * @param raceEntityList
     * @param displayGradeList
     * @param playerDataList
     */
    private filterRaceEntityForBoatrace(
        raceEntityList: BoatraceRaceEntity[],
        displayGradeList: BoatraceGradeType[],
        playerDataList: PlayerData[],
    ): BoatraceRaceEntity[] {
        const filteredRaceEntityList: BoatraceRaceEntity[] =
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
                    BoatraceSpecifiedGradeAndStageList.find((raceGradeList) => {
                        return (
                            displayGradeList.includes(
                                raceEntity.raceData.grade,
                            ) &&
                            raceGradeList.grade === raceEntity.raceData.grade &&
                            raceGradeList.stage === raceEntity.raceData.stage
                        );
                    })?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }
}
