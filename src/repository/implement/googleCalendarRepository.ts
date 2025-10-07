import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import {
    fromGoogleCalendarDataToCalendarData,
    toGoogleCalendarData,
} from '../../utility/googleCalendar';
import { Logger } from '../../utility/logger';
import { SearchCalendarFilterEntity } from '../entity/filter/searchCalendarFilterEntity';
import { RaceEntity } from '../entity/raceEntity';
import { ICalendarRepository } from '../interface/ICalendarRepository';

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
     */
    @Logger
    public async getEvents(
        searchFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarData[]> {
        const calendarDataList: CalendarData[] = [];
        const { startDate, finishDate, raceTypeList } = searchFilter;
        for (const raceType of raceTypeList) {
            // GoogleカレンダーAPIからイベントを取得
            try {
                const tempCalendarDataList =
                    await this.googleCalendarGateway.fetchCalendarDataList(
                        raceType,
                        startDate,
                        finishDate,
                    );
                calendarDataList.push(
                    ...tempCalendarDataList.map((calendarData) =>
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
     * @param commonParameter
     * @param raceEntityList
     */
    @Logger
    public async upsertEvents(raceEntityList: RaceEntity[]): Promise<void> {
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
                                console.debug('calendarData', calendarData.id);
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
