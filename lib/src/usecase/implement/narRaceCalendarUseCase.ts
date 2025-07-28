import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { NarGradeType } from '../../utility/data/nar/narGradeType';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IOldRaceCalendarUseCase } from '../interface/IOldRaceCalendarUseCase';

/**
 * Narレースカレンダーユースケース
 */
@injectable()
export class NarRaceCalendarUseCase implements IOldRaceCalendarUseCase {
    public constructor(
        @inject('PublicGamblingCalendarService')
        private readonly publicGamblingCalendarService: ICalendarService,
        @inject('NarRaceDataService')
        private readonly raceDataService: IRaceDataService<
            NarRaceEntity,
            NarPlaceEntity
        >,
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
        displayGradeList: NarGradeType[],
    ): Promise<void> {
        // レース情報を取得する
        const raceEntityList: NarRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList: NarRaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                displayGradeList.includes(raceEntity.raceData.grade),
        );
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['nar'],
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
            nar: deleteCalendarDataList,
            world: [],
            keirin: [],
            boatrace: [],
            autorace: [],
        });

        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: NarRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.publicGamblingCalendarService.upsertEvents({
            nar: upsertRaceEntityList,
        });
    }
}
