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
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchCalendarFilterEntity } from '../entity/searchCalendarFilterEntity';
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
     * @param raceTypeList - レース種別のリスト
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
     * @param raceEntityList
     */
    @Logger
    public async upsertEvents(
        raceEntityList:
            | JraRaceEntity[]
            | HorseRacingRaceEntity[]
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
                            .fetchCalendarData(
                                raceEntity.raceData.raceType,
                                raceEntity.id,
                            )
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
                              raceEntity.raceData.raceType,
                              toGoogleCalendarData(raceEntity),
                          )
                        : this.googleCalendarGateway.insertCalendarData(
                              raceEntity.raceData.raceType,
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
     * @param calendarDataList
     */
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await Promise.all(
            calendarDataList.map(async (calendarData) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
                        calendarData.raceType,
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
