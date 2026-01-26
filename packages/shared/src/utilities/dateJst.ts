/**
 * 日本時間（JST）での日付操作ユーティリティ
 *
 * このモジュールは、JavaScript標準のDateオブジェクトとIntl APIを活用して、
 * Cloudflare Workers、ブラウザ、Node.jsなど、あらゆる環境で一貫した
 * 日本時間の扱いを提供します。
 *
 * ## 設計方針
 * - Dateオブジェクトは常にUTCとして内部保存
 * - Intl.DateTimeFormatでJST表示・取得を実現
 * - タイムゾーンオフセットの手動計算を避ける
 * - 環境のタイムゾーン設定に依存しない
 *
 * ## ベストプラクティス
 * - データベースには常にUTCで保存
 * - 表示時のみJSTに変換
 * - DST（夏時間）の心配不要（日本にはDSTが存在しない）
 */

/**
 * 日本のタイムゾーン識別子
 */
export const JST_TIMEZONE = 'Asia/Tokyo';

/**
 * 日本時間（JST）で日付を作成
 *
 * ISO 8601形式の文字列から、JSTの日時として解釈されるDateオブジェクトを作成します。
 * 内部的にはUTCで保存されますが、指定した日時がJST基準であることを保証します。
 *
 * @param year 年
 * @param month 月（1-12）
 * @param day 日
 * @param hour 時（0-23）デフォルト0
 * @param minute 分（0-59）デフォルト0
 * @param second 秒（0-59）デフォルト0
 * @returns JST時刻のDateオブジェクト（内部はUTC）
 *
 * @example
 * ```typescript
 * // JST 2024-04-26 00:00:00を作成
 * const date = createJstDate(2024, 4, 26);
 * console.log(date.toISOString()); // "2024-04-25T15:00:00.000Z" (UTC)
 * console.log(formatJstDate(date)); // "2024/4/26 0:00:00" (JST表示)
 * ```
 */
export function createJstDate(
    year: number,
    month: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
): Date {
    // ISO 8601形式の文字列を作成
    // タイムゾーンオフセット+09:00を明示的に指定
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+09:00`;
    return new Date(dateString);
}

/**
 * DateオブジェクトからJST（日本時間）での年を取得
 *
 * @param date Dateオブジェクト
 * @returns JST年
 *
 * @example
 * ```typescript
 * const date = new Date('2024-04-25T15:00:00Z'); // UTC
 * console.log(getJstYear(date)); // 2024 (JSTでは2024-04-26)
 * ```
 */
export function getJstYear(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            year: 'numeric',
        }),
    );
}

/**
 * DateオブジェクトからJST（日本時間）での月を取得
 *
 * @param date Dateオブジェクト
 * @returns JST月（1-12）
 */
export function getJstMonth(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            month: 'numeric',
        }),
    );
}

/**
 * DateオブジェクトからJST（日本時間）での日を取得
 *
 * @param date Dateオブジェクト
 * @returns JST日（1-31）
 */
export function getJstDate(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            day: 'numeric',
        }),
    );
}

/**
 * DateオブジェクトからJST（日本時間）での時を取得
 *
 * @param date Dateオブジェクト
 * @returns JST時（0-23）
 */
export function getJstHours(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            hour: 'numeric',
            hour12: false,
        }),
    );
}

/**
 * DateオブジェクトからJST（日本時間）での分を取得
 *
 * @param date Dateオブジェクト
 * @returns JST分（0-59）
 */
export function getJstMinutes(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            minute: 'numeric',
        }),
    );
}

/**
 * DateオブジェクトからJST（日本時間）での秒を取得
 *
 * @param date Dateオブジェクト
 * @returns JST秒（0-59）
 */
export function getJstSeconds(date: Date): number {
    return Number.parseInt(
        date.toLocaleString('ja-JP', {
            timeZone: JST_TIMEZONE,
            second: 'numeric',
        }),
    );
}

/**
 * DateオブジェクトをJST文字列に変換
 *
 * @param date Dateオブジェクト
 * @param options フォーマットオプション（Intl.DateTimeFormatOptions）
 * @returns JST文字列
 *
 * @example
 * ```typescript
 * const date = new Date('2024-04-25T15:00:00Z');
 * console.log(formatJstDate(date)); // "2024/4/26 0:00:00"
 * console.log(formatJstDate(date, { dateStyle: 'full' })); // "2024年4月26日金曜日"
 * ```
 */
export function formatJstDate(
    date: Date,
    options?: Intl.DateTimeFormatOptions,
): string {
    return date.toLocaleString('ja-JP', {
        timeZone: JST_TIMEZONE,
        ...options,
    });
}

/**
 * 現在のJST日時を取得
 *
 * @returns 現在のJST日時のDateオブジェクト
 *
 * @example
 * ```typescript
 * const now = getJstNow();
 * console.log(formatJstDate(now)); // "2024/4/26 12:34:56"
 * ```
 */
export function getJstNow(): Date {
    return new Date();
}

/**
 * DateオブジェクトをJST ISO 8601形式の文字列に変換
 *
 * @param date Dateオブジェクト
 * @returns JST ISO 8601形式の文字列（例: "2024-04-26T00:00:00+09:00"）
 *
 * @example
 * ```typescript
 * const date = createJstDate(2024, 4, 26);
 * console.log(toJstISOString(date)); // "2024-04-26T00:00:00+09:00"
 * ```
 */
export function toJstISOString(date: Date): string {
    const year = getJstYear(date);
    const month = getJstMonth(date);
    const day = getJstDate(date);
    const hour = getJstHours(date);
    const minute = getJstMinutes(date);
    const second = getJstSeconds(date);

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+09:00`;
}
