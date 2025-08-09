export const getGoogleCalendarColorId = (
    raceType: RaceType,
    gradeType: GradeType,
): GoogleCalendarColorIdType => {
    return (
        GoogleCalendarColorIdMap[raceType][gradeType] ??
        GoogleCalendarColorId.GRAPHITE
    );
};
import type { GradeType } from './data/common/gradeType';
import type { RaceType } from './raceType';

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

/**
 * 各競技ごとのグレード→色IDマップをRaceTypeでまとめる
 */
// ...existing code...
const GoogleCalendarColorIdMap = {
    JRA: {
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
    },
    NAR: {
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
    },
    WORLD: {
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        Listed: GoogleCalendarColorId.BANANA,
        格付けなし: GoogleCalendarColorId.GRAPHITE,
    },
    KEIRIN: {
        GP: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        FⅠ: GoogleCalendarColorId.GRAPHITE,
        FⅡ: GoogleCalendarColorId.GRAPHITE,
    },
    BOATRACE: {
        SG: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        GⅢ: GoogleCalendarColorId.BASIL,
        一般: GoogleCalendarColorId.GRAPHITE,
    },
    AUTORACE: {
        SG: GoogleCalendarColorId.BLUEBERRY,
        特GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅠ: GoogleCalendarColorId.BLUEBERRY,
        GⅡ: GoogleCalendarColorId.TOMATO,
        開催: GoogleCalendarColorId.GRAPHITE,
    },
} as Record<RaceType, Record<GradeType, GoogleCalendarColorIdType>>;
