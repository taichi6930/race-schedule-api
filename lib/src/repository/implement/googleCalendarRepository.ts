import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarData } from '../../domain/calendarData';
import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import { fromGoogleCalendarDataToCalendarData } from '../../utility/googleCalendar';
import { RaceType } from '../../utility/raceType';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';

/**
 * 開催データリポジトリの基底クラス
 */
@injectable()
export class GoogleCalendarRepository implements ICalendarRepository {
    public constructor(
        @inject('GoogleCalendarGateway')
        protected readonly googleCalendarGateway: ICalendarGateway,
    ) {}

    /**
     * カレンダーのイベントの取得を行う
     * @param raceType
     * @param searchFilter
     */
    public async getEvents(
        raceType: RaceType,
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<CalendarData[]> {
        // GoogleカレンダーAPIからイベントを取得
        try {
            const calendarDataList =
                await this.googleCalendarGateway.fetchCalendarDataList(
                    raceType,
                    searchFilter.startDate,
                    searchFilter.finishDate,
                );
            return calendarDataList.map((calendarData) =>
                fromGoogleCalendarDataToCalendarData(raceType, calendarData),
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return [];
        }
    }

    // /**
    //  * カレンダーのイベントの更新を行う
    //  * @param raceEntityList
    //  */
    // public async upsertEvents(raceEntityList: R[]): Promise<void> {
    //     // Googleカレンダーから取得する
    //     await Promise.all(
    //         raceEntityList.map(async (raceEntity) => {
    //             try {
    //                 // 既に登録されているかどうか判定
    //                 let isExist = false;
    //                 try {
    //                     await this.googleCalendarGateway
    //                         .fetchCalendarData(raceEntity.id)
    //                         .then((calendarData) => {
    //                             console.debug('calendarData', calendarData);
    //                         });
    //                     isExist = true;
    //                 } catch (error) {
    //                     console.error(
    //                         'Google Calendar APIからのイベント取得に失敗しました',
    //                         error,
    //                     );
    //                 }
    //                 // 既存のデータがあれば更新、なければ新規登録
    //                 await (isExist
    //                     ? this.googleCalendarGateway.updateCalendarData(
    //                           raceEntity.toGoogleCalendarData(),
    //                       )
    //                     : this.googleCalendarGateway.insertCalendarData(
    //                           raceEntity.toGoogleCalendarData(),
    //                       ));
    //             } catch (error) {
    //                 console.error(
    //                     'Google Calendar APIへのイベント登録に失敗しました',
    //                     error,
    //                 );
    //             }
    //         }),
    //     );
    // }

    /**
     * カレンダーのイベントの削除を行う
     * @param raceType
     * @param calendarDataList
     */
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
