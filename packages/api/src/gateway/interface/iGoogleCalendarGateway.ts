import type { RaceType } from '@race-schedule/shared/src/types';
import type { calendar_v3 } from 'googleapis';

/**
 * Googleカレンダーとの連携を担当するゲートウェイインターフェース
 *
 * このインターフェースは、レース開催情報をGoogleカレンダーのイベントとして
 * 管理するための機能を提供します。主な責務：
 * - カレンダーイベントの取得（一括・個別）
 *
 * 特徴：
 * - Google Calendar API v3を使用
 * - イベントの一意識別子（eventId）による管理
 * - バッチ処理による効率的な操作
 * - APIレート制限への対応
 */
export interface IGoogleCalendarGateway {
    /**
     * 指定された期間のカレンダーイベントを一括取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 指定された期間のイベントをクエリ
     * 2. ページネーション処理による全イベントの取得
     * 3. タイムゾーンの正規化
     * @param raceType - レース種別
     * @param startDate - 取得開始日（この日を含む）
     * @param finishDate - 取得終了日（この日を含む）
     * @returns イベントオブジェクトの配列。イベントが存在しない場合は空配列
     * @throws Error 以下の場合にエラーが発生：
     *               - API呼び出しに失敗
     *               - レート制限に到達
     *               - 認証/認可エラー
     */
    fetchCalendarDataList: (
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ) => Promise<calendar_v3.Schema$Event[]>;

    /**
     * 指定されたIDのカレンダーイベントを取得します
     *
     * このメソッドは、個別のイベントの詳細情報が必要な場合に使用します。
     * イベントが存在しない場合はエラーとなります。
     * @param raceType - レース種別
     * @param eventId - 取得するイベントの一意識別子
     * @returns イベントオブジェクト
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    fetchCalendarData: (
        raceType: RaceType,
        eventId: string,
    ) => Promise<calendar_v3.Schema$Event>;
}
