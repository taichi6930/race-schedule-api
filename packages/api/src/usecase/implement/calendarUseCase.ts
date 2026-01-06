import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarDataDto } from '../../domain/calendarData';
import type { ICalendarService } from '../../service/interface/ICalendarService';
import type { SearchCalendarFilterEntity } from '../dto/searchCalendarFilterEntity';
import type { ICalendarUseCase } from '../interface/ICalendarUseCase';

/**
 * Calendar に関する業務ロジック（UseCase）
 */
@injectable()
export class CalendarUseCase implements ICalendarUseCase {
    public constructor(
        @inject('ICalendarService')
        private readonly calendarService: ICalendarService,
    ) {}

    /**
     * カレンダーデータを取得する
     * @param searchCalendarFilter - 検索フィルター
     * @return カレンダーデータ一覧
     */
    public async fetch(
        searchCalendarFilter: SearchCalendarFilterEntity,
    ): Promise<CalendarDataDto[]> {
        return this.calendarService.fetch(searchCalendarFilter);
    }
}
