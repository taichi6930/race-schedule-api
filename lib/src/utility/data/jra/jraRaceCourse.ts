import { z } from 'zod';

/**
 * JraRaceCourseのzod型定義
 */
export const JraRaceCourseSchema = z.string().refine((value) => {
    return JraRaceCourseList.has(value);
}, '中央の競馬場ではありません');

/**
 * JraRaceCourseの型定義
 */
export type JraRaceCourse = z.infer<typeof JraRaceCourseSchema>;

/**
 * JRAの競馬場 リスト
 */
const JraRaceCourseList = new Set([
    '札幌',
    '函館',
    '福島',
    '新潟',
    '東京',
    '中山',
    '中京',
    '京都',
    '阪神',
    '小倉',
]);

/**
 * 開催中央競馬場のバリデーション
 */
export const validateJraRaceCourse = (course: string): JraRaceCourse =>
    JraRaceCourseSchema.parse(course);
