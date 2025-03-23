import { z } from 'zod';

/**
 * JraRaceCourseTypeのzod型定義
 */
const JraRaceCourseTypeSchema = z.string().refine((value) => {
    return JraRaceCourseTypeList.has(value);
}, '中央競馬の馬場種別ではありません');

/**
 * JraRaceCourseTypeの型定義
 */
export type JraRaceCourseType = z.infer<typeof JraRaceCourseTypeSchema>;

/**
 * JRAの競馬の馬場種別 リスト
 */
const JraRaceCourseTypeList = new Set(['芝', 'ダート', '障害']);

/**
 * 中央競馬の馬場種別のバリデーション
 * @param type - 中央競馬の馬場種別
 * @returns - バリデーション済みの中央競馬の馬場種別
 */
export const validateJraRaceCourseType = (type: string): JraRaceCourseType =>
    JraRaceCourseTypeSchema.parse(type);
