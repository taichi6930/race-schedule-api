import type { CalendarDataDto } from '../../domain/calendarData';
import type { CalendarFilterParams } from '../../types/calendar';

/**
 * Calendar に関する業務ロジック（UseCase）のインターフェース定義
 */
export interface ICalendarUseCase {
    /**
     * カレンダーデータを取得する
     * @return カレンダーデータ一覧
     */
    fetch: (
        calendarFilterParams: CalendarFilterParams,
    ) => Promise<CalendarDataDto[]>;
}
