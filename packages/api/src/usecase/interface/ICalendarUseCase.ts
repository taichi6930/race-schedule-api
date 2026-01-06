import type { CalendarDataDto } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../dto/searchCalendarFilterEntity';

/**
 * Calendar に関する業務ロジック（UseCase）のインターフェース定義
 */
export interface ICalendarUseCase {
    /**
     * カレンダーデータを取得する
     * @return カレンダーデータ一覧
     */
    fetch: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;
}
