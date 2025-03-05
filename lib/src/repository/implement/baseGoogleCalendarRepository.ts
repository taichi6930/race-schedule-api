import 'reflect-metadata';

import type { CalendarData } from '../../domain/calendarData';
import type { ICalendarGateway } from '../../gateway/interface/iCalendarGateway';
import type { IRaceEntity } from '../entity/iRaceEntity';
import type { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import type { ICalendarRepository } from '../interface/ICalendarRepository';

/**
 * 開催データリポジトリの基底クラス
 */
export abstract class BaseGoogleCalendarRepository<R extends IRaceEntity<R>>
    implements ICalendarRepository<R>
{
    protected abstract googleCalendarGateway: ICalendarGateway;
    protected abstract fromGoogleCalendarDataToCalendarData(
        event: object,
    ): CalendarData;

    /**
     * カレンダーのイベントの取得を行う
     * @param searchFilter
     * @returns
     */
    async getEvents(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<CalendarData[]> {
        // GoogleカレンダーAPIからイベントを取得
        try {
            const calendarDataList =
                await this.googleCalendarGateway.fetchCalendarDataList(
                    searchFilter.startDate,
                    searchFilter.finishDate,
                );
            return calendarDataList.map((calendarData) =>
                this.fromGoogleCalendarDataToCalendarData(calendarData),
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
            return [];
        }
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    async upsertEvents(raceEntityList: R[]): Promise<void> {
        // Googleカレンダーから取得する
        await Promise.all(
            raceEntityList.map(async (raceEntity) => {
                try {
                    // 既に登録されているかどうか判定
                    let isExist = false;
                    try {
                        await this.googleCalendarGateway
                            .fetchCalendarData(raceEntity.id)
                            .then((calendarData) => {
                                console.debug('calendarData', calendarData);
                                isExist = true;
                            });
                    } catch (error) {
                        console.error(
                            'Google Calendar APIからのイベント取得に失敗しました',
                            error,
                        );
                    }
                    if (isExist) {
                        // 既に登録されている場合は更新
                        await this.googleCalendarGateway.updateCalendarData(
                            raceEntity.toGoogleCalendarData(),
                        );
                    } else {
                        // 新規登録
                        await this.googleCalendarGateway.insertCalendarData(
                            raceEntity.toGoogleCalendarData(),
                        );
                    }
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
    async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        await Promise.all(
            calendarDataList.map(async (calendarData) => {
                try {
                    await this.googleCalendarGateway.deleteCalendarData(
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
