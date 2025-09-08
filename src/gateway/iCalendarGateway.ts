import type { calendar_v3 } from 'googleapis';

import type { SearchCalendarFilterEntity } from '../repository/entity/searchCalendarFilterEntity';
import type { CommonParameter } from '../utility/commonParameter';
import type { RaceType } from '../utility/raceType';

/**
 * Googleカレンダーとの連携を担当するゲートウェイインターフェース
 *
 * このインターフェースは、レース開催情報をGoogleカレンダーのイベントとして
 * 管理するための機能を提供します。主な責務：
 * - カレンダーイベントの取得（一括・個別）
 * - イベントの作成・更新
 * - イベントの削除
 *
 * 特徴：
 * - Google Calendar API v3を使用
 * - イベントの一意識別子（eventId）による管理
 * - バッチ処理による効率的な操作
 * - APIレート制限への対応
 *
 * 注意事項：
 * - APIの呼び出し回数に制限があります
 * - 認証情報の適切な管理が必要です
 * - タイムゾーンの正確な処理が重要です
 */
export interface ICalendarGateway {
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
        commonParameter: CommonParameter,
        searchCalendarFilter: SearchCalendarFilterEntity,
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
        commonParameter: CommonParameter,
        raceType: RaceType,
        eventId: string,
    ) => Promise<calendar_v3.Schema$Event>;

    /**
     * 既存のカレンダーイベントを更新します
     *
     * このメソッドは既存のイベントの内容を更新します。
     * イベントが存在しない場合はエラーとなります。
     *
     * 更新可能な主な項目：
     * - イベントのタイトル
     * - 開始・終了日時
     * - 場所情報
     * - イベントの説明
     * @param raceType - レース種別
     * @param calendarData - 更新するイベントの完全なデータ
     * eventIdを含む必要があります
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - データの形式が不正
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    updateCalendarData: (
        commonParameter: CommonParameter,
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * 新しいカレンダーイベントを作成します
     *
     * このメソッドは、レース開催情報を新しいイベントとして
     * カレンダーに追加します。
     *
     * イベントデータに含める必要がある項目：
     * - イベントのタイトル（必須）
     * - 開始日時（必須）
     * - 終了日時（必須）
     * - 場所情報（推奨）
     * - イベントの説明（推奨）
     * @param raceType - レース種別
     * @param calendarData - 作成するイベントのデータ
     * eventIdは指定しないでください
     * @throws Error 以下の場合にエラーが発生：
     *               - 必須項目が不足
     *               - データの形式が不正
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    insertCalendarData: (
        commonParameter: CommonParameter,
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * 指定されたカレンダーイベントを削除します
     *
     * このメソッドは、不要になったイベントをカレンダーから
     * 完全に削除します。この操作は取り消すことができません。
     *
     * 主な使用ケース：
     * - レースが中止になった場合
     * - イベント情報が誤っていた場合
     * - 重複したイベントを整理する場合
     * @param raceType - レース種別
     * @param eventId - 削除するイベントの一意識別子
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    deleteCalendarData: (
        commonParameter: CommonParameter,
        raceType: RaceType,
        eventId: string,
    ) => Promise<void>;
}
