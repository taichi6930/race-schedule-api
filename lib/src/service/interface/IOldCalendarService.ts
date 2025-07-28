import type { CalendarData } from '../../domain/calendarData';
import type { IRaceEntity } from '../../repository/entity/iRaceEntity';

/**
 * カレンダーサービスのインターフェース
 *
 * このインターフェースは、外部カレンダーサービス（主にGoogleカレンダー）との
 * 連携機能を提供します。主な機能は以下の通りです：
 * - カレンダーイベントの取得
 * - レース情報のカレンダーイベントとしての登録/更新
 * - 不要になったイベントの削除
 *
 * カレンダーイベントには以下の情報が含まれます：
 * - レース名
 * - 開催日時
 * - 開催場所
 * - レースの詳細情報（グレード、距離など）
 * @typeParam R - レース開催エンティティの型。IRaceEntityを実装している必要があります。
 *               このエンティティの情報がカレンダーイベントに変換されます。
 */
export interface IOldCalendarService<R extends IRaceEntity<R>> {
    /**
     * レース情報をカレンダーイベントとして登録/更新します
     *
     * 提供されたレースエンティティの情報を基に、カレンダーイベントを作成または更新します。
     * - 同じ日時・場所のイベントが存在しない場合は新規作成
     * - 既存のイベントが存在する場合は内容を更新
     * @param raceEntityList - 登録/更新するレース開催エンティティの配列
     * @throws Error イベントの登録/更新に失敗した場合
     */
    upsertEvents: (raceEntityList: R[]) => Promise<void>;
    /**
     * 指定されたカレンダーイベントを削除します
     *
     * 通常、以下のような場合に使用されます：
     * - レースが中止になった場合
     * - イベント情報が誤っていた場合
     * - 重複したイベントを整理する場合
     * @param calendarDataList - 削除するカレンダーイベントの配列
     * @throws Error イベントの削除に失敗した場合
     */
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
