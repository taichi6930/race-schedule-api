/**
 * コースコード種別の型定義
 */

export type CourseCodeType =
    (typeof CourseCodeType)[keyof typeof CourseCodeType];
/**
 * コースコード種別
 */

export const CourseCodeType = {
    // 公式
    OFFICIAL: 'OFFICIAL',
    // netkeiba
    NETKEIBA: 'NETKEIBA',
} as const;
