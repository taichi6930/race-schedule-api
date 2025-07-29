import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { BoatraceSpecifiedGradeAndStageList } from '../../utility/data/boatrace/boatraceRaceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/sqlite';
import { IOldRaceCalendarUseCase } from '../interface/IOldRaceCalendarUseCase';

/**
 * Boatraceレースカレンダーユースケース
 */
@injectable()
export class BoatraceRaceCalendarUseCase implements IOldRaceCalendarUseCase {
    public constructor(
        @inject('PublicGamblingCalendarService')
        private readonly publicGamblingCalendarService: ICalendarService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerDataService,
    ) {}

    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    @Logger
    public async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: BoatraceGradeType[],
    ): Promise<void> {
        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['boatrace'],
            DataLocation.Storage,
        );
        const raceEntityList: BoatraceRaceEntity[] = _raceEntityList.boatrace;

        const playerList = this.playerDataService.fetchPlayerDataList(
            RaceType.BOATRACE,
        );

        const filteredRaceEntityList: BoatraceRaceEntity[] =
            this.filterRaceEntity(raceEntityList, displayGradeList, playerList);

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['boatrace'],
            );

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList: CalendarData[] = calendarDataList.filter(
            (calendarData) =>
                !filteredRaceEntityList.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                ),
        );
        await this.publicGamblingCalendarService.deleteEvents({
            jra: [],
            nar: [],
            world: [],
            keirin: [],
            boatrace: deleteCalendarDataList,
            autorace: [],
        });

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: BoatraceRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.publicGamblingCalendarService.upsertEvents({
            boatrace: upsertRaceEntityList,
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
    private filterRaceEntity(
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
