import type { CalendarDataDto } from '../../domain/calendarData';
import type { CalendarFilterParams } from '../../types/calendar';

/**
 * カレンダー関連の業務ロジック（Service）のインターフェース定義
 */
export interface ICalendarService {
    /**
     * カレンダーデータを取得する
     * @param params - カレンダー検索フィルター
     */
    fetch: (params: CalendarFilterParams) => Promise<CalendarDataDto[]>;
}
