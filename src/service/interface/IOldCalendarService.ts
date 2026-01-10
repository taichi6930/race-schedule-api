import type { CalendarDataDto } from '../../../packages/api/src/domain/calendarData';
import type { OldSearchCalendarFilterEntity } from '../../repository/entity/filter/oldSearchCalendarFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';

export interface IOldCalendarService {
    /**
     * 指定期間・種別のカレンダーイベントを取得
     * @param searchCalendarFilter - カレンダーフィルター情報
     * @returns カレンダーイベント配列
     */
    fetchEvents: (
        searchCalendarFilter: OldSearchCalendarFilterEntity,
    ) => Promise<CalendarDataDto[]>;

    /**
     * レース情報をカレンダーイベントとして登録・更新
     * @param raceEntityList - 登録・更新するレースエンティティ配列
     */
    upsertEventList: (raceEntityList: RaceEntity[]) => Promise<void>;

    /**
     * 指定したカレンダーイベントを削除
     * @param calendarDataList - 削除するカレンダーイベント配列
     */
    deleteEventList: (calendarDataList: CalendarDataDto[]) => Promise<void>;
}
