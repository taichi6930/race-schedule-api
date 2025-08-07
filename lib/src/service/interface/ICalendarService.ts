import type { CalendarData } from '../../domain/calendarData';
import type { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import type { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import type { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import type { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';

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
        raceTypeList: RaceType[],
    ) => Promise<CalendarData[]>;

    /**
     * レース情報をカレンダーイベントとして登録・更新します
     *
     * このメソッドは、レースエンティティの情報をGoogleカレンダーの
     * イベントとして同期します。既存のイベントは更新され、
     * 新しいレースは新規イベントとして作成されます。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param raceEntityList - 登録・更新するレースエンティティの配列
     * @param raceEntityList.jra
     * @param raceEntityList.nar
     * @param raceEntityList.keirin
     * @param raceEntityList.world
     * @param raceEntityList.boatrace
     * @param raceEntityList.autorace
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    upsertEvents: (raceEntityList: {
        jra?: JraRaceEntity[];
        nar?: NarRaceEntity[];
        keirin?: KeirinRaceEntity[];
        world?: WorldRaceEntity[];
        boatrace?: BoatraceRaceEntity[];
        autorace?: AutoraceRaceEntity[];
    }) => Promise<void>;

    /**
     * 指定されたカレンダーイベントを削除します
     *
     * このメソッドは、不要になったレースイベント（中止された
     * レースなど）をカレンダーから削除します。削除は完全な
     * 削除であり、元に戻すことはできません。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param calendarDataList - 削除するカレンダーイベントの配列
     * @param calendarDataList.jra
     * @param calendarDataList.nar
     * @param calendarDataList.keirin
     * @param calendarDataList.world
     * @param calendarDataList.boatrace
     * @param calendarDataList.autorace
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    deleteEvents: (calendarDataList: {
        jra?: CalendarData[];
        nar?: CalendarData[];
        keirin?: CalendarData[];
        world?: CalendarData[];
        boatrace?: CalendarData[];
        autorace?: CalendarData[];
    }) => Promise<void>;
}
