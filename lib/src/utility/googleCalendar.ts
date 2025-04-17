import type { AutoraceGradeType } from './data/autorace/autoraceGradeType';
import type { BoatraceGradeType } from './data/boatrace/boatraceGradeType';
import type { JraGradeType } from './data/jra/jraGradeType';
import type { KeirinGradeType } from './data/keirin/keirinGradeType';
import type { NarGradeType } from './data/nar/narGradeType';
import type { WorldGradeType } from './data/world/worldGradeType';

/**
 * Googleカレンダーのイベント表示をカスタマイズするためのユーティリティモジュール
 *
 * このモジュールは、各種レース競技のイベントを視覚的に区別するための
 * 色分け機能を提供します。主な機能：
 * - レースのグレードに応じた色の割り当て
 * - 競技種目ごとの一貫した色使い
 * - 重要度に基づく視認性の調整
 */

/**
 * Googleカレンダーで使用可能な色IDの定義
 *
 * 各色はカレンダーイベントの視認性と重要度を表現するために
 * 慎重に選択されています：
 *
 * 基本的な色使いの方針：
 * - 高グレード（GI/GP等）: 濃い青系（視認性重視）
 * - 中グレード（GⅡ等）: 赤系（重要イベント）
 * - 低グレード：緑系や灰色（通常イベント）
 */
const GoogleCalendarColorId = {
    LAVENDER: '1', // #7986CB
    SAGE: '2', // #33B679
    GRAPE: '3', // #8E24AA
    FLAMINGO: '4', // #E67C73
    BANANA: '5', // #F6BF26
    TANGERINE: '6', // #F4511E
    PEACOCK: '7', // #039BE5
    GRAPHITE: '8', // #616161
    BLUEBERRY: '9', // #3F51B5
    BASIL: '10', // #0B8043
    TOMATO: '11', // #D50000
} as const;

/**
 * Google Calendar APIの色IDの型
 */
type GoogleCalendarColorIdType =
    (typeof GoogleCalendarColorId)[keyof typeof GoogleCalendarColorId];

/**
 * 中央競馬（JRA）のグレードごとの色設定
 *
 * 中央競馬の特徴的なグレード体系に対応
 */
const JraGoogleCalendarColorIdMap: Record<
    JraGradeType,
    GoogleCalendarColorIdType
> = {
    'GⅠ': GoogleCalendarColorId.BLUEBERRY,
    'GⅡ': GoogleCalendarColorId.TOMATO,
    'GⅢ': GoogleCalendarColorId.BASIL,
    'J.GⅠ': GoogleCalendarColorId.BLUEBERRY,
    'J.GⅡ': GoogleCalendarColorId.TOMATO,
    'J.GⅢ': GoogleCalendarColorId.BASIL,
    'JpnⅠ': GoogleCalendarColorId.LAVENDER,
    'JpnⅡ': GoogleCalendarColorId.FLAMINGO,
    'JpnⅢ': GoogleCalendarColorId.SAGE,
    '重賞': GoogleCalendarColorId.BANANA,
    'Listed': GoogleCalendarColorId.BANANA,
    'オープン': GoogleCalendarColorId.TANGERINE,
    'オープン特別': GoogleCalendarColorId.TANGERINE,
};

/**
 * 中央競馬（JRA）のレースグレードに応じた表示色を取得します
 *
 * このメソッドは、JRAのレースグレードに基づいて適切な
 * カレンダー表示色を決定します
 * @param raceGrade - JRAのレースグレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getJraGoogleCalendarColorId('GⅠ');
 * // returns '9' (青色)
 * ```
 */
export const getJraGoogleCalendarColorId = (
    raceGrade: JraGradeType,
): GoogleCalendarColorIdType => {
    return (
        JraGoogleCalendarColorIdMap[raceGrade] ?? GoogleCalendarColorId.GRAPHITE
    );
};

/**
 * 地方競馬（NAR）のグレードごとの色設定
 *
 * 地方競馬特有の格付けに対応
 */
const NarGoogleCalendarColorIdMap: Record<
    NarGradeType,
    GoogleCalendarColorIdType
> = {
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    GⅢ: GoogleCalendarColorId.BASIL,
    JpnⅠ: GoogleCalendarColorId.LAVENDER,
    JpnⅡ: GoogleCalendarColorId.FLAMINGO,
    JpnⅢ: GoogleCalendarColorId.SAGE,
    重賞: GoogleCalendarColorId.BANANA,
    Listed: GoogleCalendarColorId.BANANA,
    オープン: GoogleCalendarColorId.TANGERINE,
    オープン特別: GoogleCalendarColorId.TANGERINE,
    地方重賞: GoogleCalendarColorId.GRAPE,
};

/**
 * 地方競馬（NAR）のレースグレードに応じた表示色を取得します
 *
 * このメソッドは、NARのレースグレードに基づいて適切な
 * カレンダー表示色を決定します：
 * @param raceGrade - NARのレースグレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getNarGoogleCalendarColorId('JpnⅠ');
 * // returns '1' (薄紫色)
 * ```
 */
export const getNarGoogleCalendarColorId = (
    raceGrade: NarGradeType,
): GoogleCalendarColorIdType => {
    return (
        NarGoogleCalendarColorIdMap[raceGrade] ?? GoogleCalendarColorId.GRAPHITE
    );
};

/**
 * 海外競馬のグレードごとの色設定
 *
 * 国際競馬の格付けに対応：
 * - GⅠ: 青色
 * - GⅡ: 赤色
 * - GⅢ: 緑色
 * - Listed: 黄色
 * - 格付けなし: グレー
 */
const WorldGoogleCalendarColorIdMap: Record<
    WorldGradeType,
    GoogleCalendarColorIdType
> = {
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    GⅢ: GoogleCalendarColorId.BASIL,
    Listed: GoogleCalendarColorId.BANANA,
    格付けなし: GoogleCalendarColorId.GRAPHITE,
};

/**
 * 海外競馬のレースグレードに応じた表示色を取得します
 *
 * このメソッドは、国際格付けに基づいて適切な
 * カレンダー表示色を決定します：
 * @param raceGrade - 国際グレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getWorldGoogleCalendarColorId('GⅠ');
 * // returns '9' (青色)
 * ```
 */
export const getWorldGoogleCalendarColorId = (
    raceGrade: WorldGradeType,
): GoogleCalendarColorIdType => {
    return WorldGoogleCalendarColorIdMap[raceGrade];
};

/**
 * 競輪のグレードごとの色設定
 *
 * 競輪特有のグレード体系に対応：
 * - GP/GⅠ: 青色
 * - GⅡ: 赤色
 * - GⅢ: 緑色
 * - FⅠ/FⅡ: グレー
 */
const KeirinGoogleCalendarColorIdMap: Record<
    KeirinGradeType,
    GoogleCalendarColorIdType
> = {
    GP: GoogleCalendarColorId.BLUEBERRY,
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    GⅢ: GoogleCalendarColorId.BASIL,
    FⅠ: GoogleCalendarColorId.GRAPHITE,
    FⅡ: GoogleCalendarColorId.GRAPHITE,
};

/**
 * 競輪のレースグレードに応じた表示色を取得します
 *
 * このメソッドは、競輪のグレードに基づいて適切な
 * カレンダー表示色を決定します：
 * - GP/GⅠ: 青色
 * - GⅡ: 赤色
 * - GⅢ: 緑色
 * - FⅠ/FⅡ: グレー
 * @param raceGrade - 競輪のグレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getKeirinGoogleCalendarColorId('GP');
 * // returns '9' (青色)
 * ```
 */
export const getKeirinGoogleCalendarColorId = (
    raceGrade: KeirinGradeType,
): GoogleCalendarColorIdType => {
    return KeirinGoogleCalendarColorIdMap[raceGrade];
};

/**
 * 競艇（ボートレース）のグレードごとの色設定
 *
 * 競艇特有のグレード体系に対応：
 * - SG: 青色
 * - GⅠ：青色
 * - GⅡ: 赤色
 * - GⅢ: 緑色
 * - 一般戦: グレー
 */
const BoatraceGoogleCalendarColorIdMap: Record<
    BoatraceGradeType,
    GoogleCalendarColorIdType
> = {
    SG: GoogleCalendarColorId.BLUEBERRY,
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    GⅢ: GoogleCalendarColorId.BASIL,
    一般: GoogleCalendarColorId.GRAPHITE,
};

/**
 * 競艇（ボートレース）のレースグレードに応じた表示色を取得します
 *
 * このメソッドは、競艇のグレードに基づいて適切な
 * カレンダー表示色を決定します：
 * - SG/GⅠ: 青色
 * - GⅡ：赤色
 * - GⅢ: 緑色
 * - 一般: グレー
 * @param raceGrade - 競艇のグレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getBoatraceGoogleCalendarColorId('SG');
 * // returns '9' (青色)
 * ```
 */
export const getBoatraceGoogleCalendarColorId = (
    raceGrade: BoatraceGradeType,
): GoogleCalendarColorIdType => {
    return BoatraceGoogleCalendarColorIdMap[raceGrade];
};

/**
 * オートレースのグレードごとの色設定
 *
 * オートレース特有のグレード体系に対応：
 * - SG/特GI: 青色
 * - GⅠ/GⅡ: 赤色
 * - 一般開催: グレー
 */
const AutoraceGoogleCalendarColorIdMap: Record<
    AutoraceGradeType,
    GoogleCalendarColorIdType
> = {
    SG: GoogleCalendarColorId.BLUEBERRY,
    特GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅠ: GoogleCalendarColorId.BLUEBERRY,
    GⅡ: GoogleCalendarColorId.TOMATO,
    開催: GoogleCalendarColorId.GRAPHITE,
};

/**
 * オートレースのレースグレードに応じた表示色を取得します
 *
 * このメソッドは、オートレースのグレードに基づいて適切な
 * カレンダー表示色を決定します：
 * - SG/特GI/GⅠ: 青色
 * - GⅡ: 赤色
 * - 開催: グレー
 * @param raceGrade - オートレースのグレード
 * @returns カレンダーイベントの色ID
 * @example
 * ```typescript
 * const colorId = getAutoraceGoogleCalendarColorId('SG');
 * // returns '9' (青色)
 * ```
 */
export const getAutoraceGoogleCalendarColorId = (
    raceGrade: AutoraceGradeType,
): GoogleCalendarColorIdType => {
    return AutoraceGoogleCalendarColorIdMap[raceGrade];
};
