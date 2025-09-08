import type { CalendarData } from '../../domain/calendarData';
import type { RaceEntityForAWS } from '../../repository/entity/raceEntity';
import type { RaceType } from '../../utility/raceType';

export interface ICalendarServiceForAWS {
    /**
     * 指定期間・種別のカレンダーイベントを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @returns カレンダーイベント配列
     */
    fetchEvents: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;

    /**
     * レース情報をカレンダーイベントとして登録・更新
     * @param raceEntityList - 登録・更新するレースエンティティ配列
     */
    upsertEvents: (raceEntityList: RaceEntityForAWS[]) => Promise<void>;

    /**
     * 指定したカレンダーイベントを削除
     * @param calendarDataList - 削除するカレンダーイベント配列
     */
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
