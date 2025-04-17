/**
 * 日付操作に関するユーティリティ関数を提供するモジュール
 *
 * このモジュールは、レース開催情報の日時処理に必要な
 * タイムゾーン変換や日付操作の機能を提供します。
 */

/**
 * 指定された日付をJST（日本標準時）に変換します
 *
 * このメソッドは、システムのタイムゾーンに関係なく、
 * 常に日本時間での正しい日時を返します。主な用途：
 * - レース開催日時の正規化
 * - カレンダーイベントの日時設定
 * - 日付での検索条件の指定
 *
 * @param date - 変換対象のDate型オブジェクト
 * @returns 日本時間に変換されたDate型オブジェクト
 * @example
 * ```typescript
 * // UTC時刻を日本時間に変換
 * const utcDate = new Date('2024-01-01T00:00:00Z');
 * const jstDate = getJSTDate(utcDate);
 * // jstDate は 2024-01-01T09:00:00+09:00
 * ```
 *
 * 注意:
 * - 入力がinvalid dateの場合も同様にinvalid dateを返します
 * - 年末年始などの日付変更をまたぐ場合は特に注意が必要です
 */
export const getJSTDate = (date: Date): Date =>
    new Date(
        date.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
        }),
    );
