import 'reflect-metadata';
import '../../utility/format';

import { CalendarData } from '../../domain/calendarData';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { ICalendarService } from '../interface/ICalendarService';

/**
 * BaseCalendarService
 */
export abstract class BaseCalendarService<R extends IRaceEntity<R>>
    implements ICalendarService<R>
{
    protected abstract calendarRepository: ICalendarRepository<R>;

    /**
     * カレンダーのイベントの取得を行う
     * @param startDate
     * @param finishDate
     */
    @Logger
    public async getEvents(
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        const searchFilter = new SearchCalendarFilterEntity(
            startDate,
            finishDate,
        );
        return await this.calendarRepository.getEvents(searchFilter);
    }

    /**
     * カレンダーのイベントの更新を行う
     * @param raceEntityList
     */
    @Logger
    public async upsertEvents(raceEntityList: R[]): Promise<void> {
        if (raceEntityList.length === 0) {
            console.debug('更新対象のイベントが見つかりませんでした。');
            return;
        }
        await this.calendarRepository.upsertEvents(raceEntityList);
    }

    /**
     * イベントの削除を行う
     * @param calendarDataList
     */
    @Logger
    public async deleteEvents(calendarDataList: CalendarData[]): Promise<void> {
        if (calendarDataList.length === 0) {
            console.debug('指定された期間にイベントが見つかりませんでした。');
            return;
        }
        await this.calendarRepository.deleteEvents(calendarDataList);
    }
}
