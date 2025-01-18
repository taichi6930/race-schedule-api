import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinPlayerList } from '../../utility/data/keirin/keirinPlayerNumber';
import { KEIRIN_SPECIFIED_GRADE_AND_STAGE_LIST } from '../../utility/data/keirin/keirinRaceStage';
import { Logger } from '../../utility/logger';
import { IRaceCalendarUseCase } from '../interface/IRaceCalendarUseCase';

@injectable()
export class KeirinRaceCalendarUseCase implements IRaceCalendarUseCase {
    constructor(
        @inject('KeirinCalendarService')
        private readonly calendarService: ICalendarService<KeirinRaceEntity>,
        @inject('KeirinRaceDataService')
        private readonly keirinRaceDataService: IRaceDataService<
            KeirinRaceEntity,
            KeirinPlaceEntity
        >,
    ) {}

    /**
     * カレンダーからレース情報の取得を行う
     * @param startDate
     * @param finishDate
     * @returns CalendarData[]
     */
    @Logger
    async getRacesFromCalendar(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        return await this.calendarService.getEvents(startDate, finishDate);
    }

    /**
     * カレンダーの更新を行う
     * @param startDate
     * @param finishDate
     * @param displayGradeList
     */
    @Logger
    async updateRacesToCalendar(
        startDate: Date,
        finishDate: Date,
        displayGradeList: KeirinGradeType[],
    ): Promise<void> {
        const raceEntityList: KeirinRaceEntity[] =
            await this.keirinRaceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                'storage',
            );

        const filteredRaceEntityList: KeirinRaceEntity[] =
            this.filterRaceEntity(raceEntityList, displayGradeList);

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
        if (deleteCalendarDataList.length > 0) {
            await this.calendarService.deleteEvents(deleteCalendarDataList);
        }

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: KeirinRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        if (upsertRaceEntityList.length > 0) {
            await this.calendarService.upsertEvents(upsertRaceEntityList);
        }
    }

    /**
     * 表示対象のレースデータのみに絞り込む
     * - 6以上の優先度を持つレースデータを表示対象とする
     * - raceEntityList.racePlayerDataListの中に選手データ（KeirinPlayerDict）が存在するかを確認する
     * @param raceEntity[]
     * @return raceEntity[]
     */
    private filterRaceEntity(
        raceEntityList: KeirinRaceEntity[],
        displayGradeList: KeirinGradeType[],
    ): KeirinRaceEntity[] {
        const filteredRaceEntityList: KeirinRaceEntity[] =
            raceEntityList.filter((raceEntity) => {
                const maxPlayerPriority = raceEntity.racePlayerDataList.reduce(
                    (maxPriority, playerData) => {
                        const playerPriority =
                            KeirinPlayerList.find(
                                (keirinPlayer) =>
                                    playerData.playerNumber ===
                                    Number(keirinPlayer.playerNumber),
                            )?.priority ?? 0;
                        return Math.max(maxPriority, playerPriority);
                    },
                    0,
                );

                const racePriority: number =
                    KEIRIN_SPECIFIED_GRADE_AND_STAGE_LIST.find(
                        (raceGradeList) => {
                            return (
                                displayGradeList.includes(
                                    raceEntity.raceData.grade,
                                ) &&
                                raceGradeList.grade ===
                                    raceEntity.raceData.grade &&
                                raceGradeList.stage ===
                                    raceEntity.raceData.stage
                            );
                        },
                    )?.priority ?? 0;

                return racePriority + maxPlayerPriority >= 6;
            });
        return filteredRaceEntityList;
    }
}
