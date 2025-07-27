import type { CalendarData } from '../../domain/calendarData';

export interface ICalendarService {
    /**
     * 指定された期間のカレンダーイベントを取得します
     *
     * 外部カレンダーサービスから、指定された期間に登録されている
     * レース関連のイベントをすべて取得します。
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param raceTypeList - 取得するレースの種類リスト
     * @returns カレンダーイベントの配列。イベントが存在しない場合は空配列
     * @throws Error 外部カレンダーサービスとの通信に失敗した場合
     */
    fetchEvents: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ) => Promise<CalendarData[]>;
}
