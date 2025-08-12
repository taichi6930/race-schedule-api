import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarData } from '../../domain/calendarData';
import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import {
    fromGoogleCalendarDataToCalendarData,
    toGoogleCalendarData,
} from '../../utility/googleCalendar';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { SearchCalendarFilterEntity } from '../entity/searchCalendarFilterEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';

/**
 * Googleカレンダーリポジトリの実装
 */
@injectable()
export class GoogleCalendarRepository implements ICalendarRepository {
    public constructor(
        @inject('GoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {}

    /**
     * カレンダーのイベントの取得を行う
     * @param raceTypeList
     * @param searchFilter
     */
    @Logger
    public async getEvents(
        raceTypeList: RaceType[],
        searchFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        for (const raceType of raceTypeList) {
            // GoogleカレンダーAPIからイベントを取得
            try {
                const _calendarDataList =
                    await this.googleCalendarGateway.fetchCalendarDataList(
                        raceType,
                        searchFilter.startDate,
                        searchFilter.finishDate,
                    );
                calendarDataList.push(
                    ..._calendarDataList.map((calendarData) =>
                        fromGoogleCalendarDataToCalendarData(
                            raceType,
                            calendarData,
                        ),
                    ),
                );
            } catch (error) {
                console.error(
                    'Google Calendar APIからのイベント取得に失敗しました',
                    error,
                );
            }
        }
        return calendarDataList;
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceType
     * @param raceEntityList
     */
    @Logger
    public async upsertEvents(
        raceType: RaceType,
        raceEntityList:
            | JraRaceEntity[]
            | NarRaceEntity[]
            | WorldRaceEntity[]
            | MechanicalRacingRaceEntity[],
    ): Promise<void> {
        // Googleカレンダーから取得する
        await Promise.all(
            raceEntityList.map(async (raceEntity) => {
                try {
                    // 既に登録されているかどうか判定
                    let isExist = false;
                    try {
                        await this.googleCalendarGateway
                            .fetchCalendarData(raceType, raceEntity.id)
                            .then((calendarData) => {
                                console.debug('calendarData', calendarData);
                            });
                        isExist = true;
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベント取得に失敗しました',
                            error,
                        );
                    }
                    // 既存のデータがあれば更新、なければ新規登録
                    await (isExist
                        ? this.googleCalendarGateway.updateCalendarData(
                              raceType,
                              toGoogleCalendarData(raceEntity),
                          )
                        : this.googleCalendarGateway.insertCalendarData(
                              raceType,
                              toGoogleCalendarData(raceEntity),
                          ));
                } catch (error) {
                    console.error(
                        'Google Calendar APIへのイベント登録に失敗しました',
                        error,
                    );
                }
            }),
        );
    }

    /**
     * カレンダーのイベントの削除を行う
     * @param raceType
     * @param calendarDataList
     */
    @Logger
    public async deleteEvents(
        raceType: RaceType,
        calendarDataList: CalendarData[],
    ): Promise<void> {
        await Promise.all(
            calendarDataList.map(async (calendarData) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        raceType,
                        calendarData.id,
                    );
                } catch (error) {
                    console.error(
                        'Google Calendar APIからのイベント削除に失敗しました',
                        error,
                    );
                }
            }),
        );
    }
}
