import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import type { CalendarDataDto } from '../../domain/calendarData';
import { ICalendarService } from '../../service/interface/ICalendarService';
import { CalendarFilterParams } from '../../types/calendar';
import type { ICalendarUsecase } from '../interface/ICalendarUsecase';

/**
 * Calendar に関する業務ロジック（Usecase）
 */
@injectable()
export class CalendarUsecase implements ICalendarUsecase {
    public constructor(
        @inject('CalendarService')
        private readonly calendarService: ICalendarService,
    ) {}

    /**
     * カレンダーデータを取得する
     * @param calendarFilterParams - 検索フィルター
     * @return カレンダーデータ一覧
     */
    public async fetch(
        params: CalendarFilterParams,
    ): Promise<CalendarDataDto[]> {
        return this.calendarService.fetch(params);
    }
}
