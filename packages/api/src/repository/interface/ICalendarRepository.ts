import type { CalendarDataDto } from '../../domain/calendarData';
import type { CalendarFilterParams } from '../../types/calendar';

/**
 * カレンダーリポジトリのインターフェース定義
 */
export interface ICalendarRepository {
    /**
     * カレンダーデータを取得する
     *
     * @param params - カレンダー検索フィルター
     * @return カレンダーデータ一覧
     */
    fetch: (params: CalendarFilterParams) => Promise<CalendarDataDto[]>;
}
