import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { PlayerData } from '../../domain/playerData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IPlayerDataService } from '../../service/interface/IPlayerDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { BoatraceSpecifiedGradeAndStageList } from '../../utility/data/boatrace/boatraceRaceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/sqlite';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

/**
 * Boatraceレースカレンダーユースケース
 */
@injectable()
export class BoatraceRaceCalendarUseCase implements IRaceCalendarUseCase {
    public constructor(
        @inject('BoatraceCalendarService')
        private readonly calendarService: ICalendarService<BoatraceRaceEntity>,
        @inject('BoatraceRaceDataService')
        private readonly raceDataService: IRaceDataService<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
        @inject('PlayerDataService')
        private readonly playerDataService: IPlayerDataService,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     */
    @Logger
    public async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        return this.calendarService.getEvents(startDate, finishDate);
    }

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
        const raceEntityList: BoatraceRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const playerList = await this.playerDataService.fetchPlayerDataList(
            RaceType.BOATRACE,
        );

        const filteredRaceEntityList: BoatraceRaceEntity[] =
            this.filterRaceEntity(raceEntityList, displayGradeList, playerList);

        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.calendarService.getEvents(startDate, finishDate);

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList: CalendarData[] = calendarDataList.filter(
            (calendarData) =>
                !filteredRaceEntityList.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                ),
        );
        await this.calendarService.deleteEvents(deleteCalendarDataList);

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: BoatraceRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.calendarService.upsertEvents(upsertRaceEntityList);
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
                                (boatracePlayer) =>
                                    playerData.playerNumber ===
                                    boatracePlayer.playerNumber,
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
