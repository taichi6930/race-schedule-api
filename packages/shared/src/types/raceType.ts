/**
 * レースタイプの列挙型
 */
export const RaceType = {
    JRA: 'JRA', // 中央競馬
    NAR: 'NAR', // 地方競馬
    KEIRIN: 'KEIRIN', // 競輪
    OVERSEAS: 'OVERSEAS', // 海外競馬
    AUTORACE: 'AUTORACE', // オートレース
    BOATRACE: 'BOATRACE', // ボートレース
    UNKNOWN: 'UNKNOWN', // 不明
} as const;

/**
 * RaceTypeの型定義
 */
export type RaceType = (typeof RaceType)[keyof typeof RaceType];
