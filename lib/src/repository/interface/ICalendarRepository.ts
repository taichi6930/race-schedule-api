import type { RaceEntity } from '../../../../src/repository/entity/raceEntity';
import type { CalendarData } from '../../domain/calendarData';
import type { SearchCalendarFilterEntityForAWS } from '../entity/searchCalendarFilterEntity';

/**
 * 外部カレンダーサービスとの連携を担当するリポジトリインターフェース
 *
 * このインターフェースは、レース開催情報を外部カレンダーサービス
 * （主にGoogleカレンダー）と同期させる機能を提供します。主な責務：
 * - カレンダーイベントの取得
 * - レース情報のイベントとしての登録/更新
 * - 不要になったイベントの削除
 *
 * 他のリポジトリと異なる特徴：
 * - 外部サービスとの双方向同期
 * - イベントの重複チェックと衝突回避
 * - カレンダー固有のフォーマット変換
 * - APIレート制限への対応
 */
export interface ICalendarRepositoryForAWS {
    /**
     * 指定された条件に基づいてカレンダーイベントを取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 検索フィルターに基づいてクエリを構築
     * 2. 外部カレンダーサービスにクエリを実行
     * 3. 取得したイベントをCalendarData形式に変換
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     * - 開始日・終了日による期間指定
     * - 開催場所による絞り込み
     * - その他の検索条件
     * @returns カレンダーイベントの配列。イベントが存在しない場合は空配列
     * @throws Error 以下の場合にエラーが発生：
     *               - 外部サービスとの通信に失敗
     *               - APIのレート制限に到達
     *               - 認証/認可エラー
     */
    getEvents: (
        searchFilter: SearchCalendarFilterEntityForAWS,
    ) => Promise<CalendarData[]>;

    /**
     * レース情報をカレンダーイベントとして一括登録/更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. レースエンティティをカレンダーイベント形式に変換
     * 2. 既存イベントとの重複チェック
     * 3. バッチ処理による一括登録/更新
     * @param raceEntityList - 登録/更新するレース開催エンティティの配列
     * @throws Error 以下の場合にエラーが発生：
     *               - イベントの重複が検出
     *               - 外部サービスとの通信に失敗
     *               - APIのレート制限に到達
     *               - 認証/認可エラー
     */
    upsertEvents: (raceEntityList: RaceEntity[]) => Promise<void>;

    /**
     * 指定されたカレンダーイベントを一括削除します
     *
     * このメソッドは以下のような場合に使用されます：
     * - レースが中止になった場合
     * - イベント情報が誤っていた場合
     * - カレンダーの同期をリセットする場合
     * @param calendarDataList - 削除するカレンダーイベントの配列
     * @throws Error 以下の場合にエラーが発生：
     *               - 削除対象のイベントが存在しない
     *               - 外部サービスとの通信に失敗
     *               - APIのレート制限に到達
     *               - 認証/認可エラー
     */
    deleteEvents: (calendarDataList: CalendarData[]) => Promise<void>;
}
