import type { CalendarDataDto } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../usecase/dto/searchCalendarFilterEntity';

/**
 * カレンダー関連の業務ロジック（Service）のインターフェース定義
 */
export interface ICalendarService {
    /**
     * カレンダーデータを取得する
     * @param searchCalendarFilter - カレンダー検索フィルター
     */
    fetch: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;
}
