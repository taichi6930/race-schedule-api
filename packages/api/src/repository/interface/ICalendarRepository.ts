import type { CalendarDataDto } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../usecase/dto/searchCalendarFilterEntity';

/**
 * カレンダーリポジトリのインターフェース定義
 */
export interface ICalendarRepository {
    /**
     * カレンダーデータを取得する
     *
     * @param searchCalendarFilter - カレンダー検索フィルター
     * @return カレンダーデータ一覧
     */
    fetch: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;
}
