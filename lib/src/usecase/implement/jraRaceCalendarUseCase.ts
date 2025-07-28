import 'reflect-metadata'; // reflect-metadataをインポート

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { IOldRaceDataService } from '../../service/interface/IOldRaceDataService';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IOldRaceCalendarUseCase } from '../interface/IOldRaceCalendarUseCase';

/**
 * Jraレースカレンダーユースケース
 */
@injectable()
export class JraRaceCalendarUseCase implements IOldRaceCalendarUseCase {
    public constructor(
        @inject('PublicGamblingCalendarService')
        private readonly publicGamblingCalendarService: ICalendarService,
        @inject('JraRaceDataService')
        private readonly raceDataService: IOldRaceDataService<
            JraRaceEntity,
            JraPlaceEntity
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
        displayGradeList: JraGradeType[],
    ): Promise<void> {
        // レース情報を取得する
        const raceEntityList: JraRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        // displayGradeListに含まれるレース情報のみを抽出
        const filteredRaceEntityList: JraRaceEntity[] = raceEntityList.filter(
            (raceEntity) =>
                displayGradeList.includes(raceEntity.raceData.grade),
        );
        // カレンダーの取得を行う
        const calendarDataList: CalendarData[] =
            await this.publicGamblingCalendarService.fetchEvents(
                startDate,
                finishDate,
                ['jra'],
            );

        // 1. raceEntityListのIDに存在しないcalendarDataListを取得
        const deleteCalendarDataList: CalendarData[] = calendarDataList.filter(
            (calendarData) =>
                !filteredRaceEntityList.some(
                    (raceEntity) => raceEntity.id === calendarData.id,
                ),
        );
        await this.publicGamblingCalendarService.deleteEvents({
            jra: deleteCalendarDataList,
            nar: [],
            world: [],
            keirin: [],
            boatrace: [],
            autorace: [],
        });
        // 2. deleteCalendarDataListのIDに該当しないraceEntityListを取得し、upsertする
        const upsertRaceEntityList: JraRaceEntity[] =
            filteredRaceEntityList.filter(
                (raceEntity) =>
                    !deleteCalendarDataList.some(
                        (deleteCalendarData) =>
                            deleteCalendarData.id === raceEntity.id,
                    ),
            );
        await this.publicGamblingCalendarService.upsertEvents({
            jra: upsertRaceEntityList,
        });
    }
}
