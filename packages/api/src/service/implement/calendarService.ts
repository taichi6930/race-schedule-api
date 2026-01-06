import { inject, injectable } from 'tsyringe';

import type { CalendarDataDto } from '../../domain/calendarData';
import type { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { CalendarFilterParams } from '../../types/calendar';
import type { ICalendarService } from '../interface/ICalendarService';

/**
 * カレンダー関連の業務ロジック（Service）の実装
 */
@injectable()
export class CalendarService implements ICalendarService {
    public constructor(
        @inject('CalendarRepository')
        private readonly calendarRepository: ICalendarRepository,
    ) {}

    /**
     * カレンダーデータを取得する
     * @param params - カレンダー検索フィルター
     */
    public async fetch(
        params: CalendarFilterParams,
    ): Promise<CalendarDataDto[]> {
        return this.calendarRepository.fetch(params);
    }
}
