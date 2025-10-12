import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntity } from '../../repository/entity/filter/searchCalendarFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';

export interface ICalendarService {
    /**
     * 指定期間・種別のカレンダーイベントを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @returns カレンダーイベント配列
     */
    fetchEvents: (
        searchCalendarFilter: SearchCalendarFilterEntity,
    ) => Promise<CalendarData[]>;

    /**
     * レース情報をカレンダーイベントとして登録・更新
     * @param raceEntityList - 登録・更新するレースエンティティ配列
     */
    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    /**
     * 指定したカレンダーイベントを削除
     * @param calendarDataList - 削除するカレンダーイベント配列
     */
    deleteEventList: (calendarDataList: CalendarData[]) => Promise<void>;
}
