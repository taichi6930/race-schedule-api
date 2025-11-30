import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../entity/filter/searchCalendarFilterEntity';
import type { RaceEntity } from '../entity/raceEntity';

/**
 * カレンダー情報のデータアクセスを抽象化するリポジトリインターフェース
 *
 * Googleカレンダーなどの外部カレンダーサービスへのアクセスを定義します
 */
export interface ICalendarRepository {
    /**
     * 検索条件に一致するカレンダーイベントの配列を取得する
     *
     * @param searchFilter - カレンダー検索フィルター
     * @returns カレンダーデータの配列
     */
    fetchEventList: (
        searchFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    /**
     * レースエンティティに基づいてカレンダーイベントを更新または挿入する
     *
     * @param raceEntityList - 更新または挿入するレースエンティティの配列
     */
    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    /**
     * 指定されたカレンダーデータのイベントを削除する
     *
     * @param calendarDataList - 削除するカレンダーデータの配列
     */
    deleteEventList: (calendarDataList: CalendarData[]) => Promise<void>;
}
