import { inject, injectable } from 'tsyringe';

import type { CalendarDataDto } from '../../domain/calendarData';
import type { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { SearchCalendarFilterEntity } from '../../usecase/dto/searchCalendarFilterEntity';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * カレンダー関連の業務ロジック（Service）の実装
 */
@injectable()
export class CalendarService implements ICalendarService {
    public constructor(
        @inject('ICalendarRepository')
        private readonly calendarRepository: ICalendarRepository,
    ) {}

    /**
     * カレンダーデータを取得する
     * @param searchCalendarFilter - カレンダー検索フィルター
     */
    public async fetch(
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarDataDto[]> {
        return this.calendarRepository.fetch(searchCalendarFilter);
    }
}
