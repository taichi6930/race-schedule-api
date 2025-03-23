import { z } from 'zod';

/**
 * NarRaceCourseTypeのzod型定義
 */
const NarRaceCourseTypeSchema = z.string().refine((value) => {
    return NarRaceCourseTypeList.has(value);
}, '地方競馬の馬場種別ではありません');

/**
 * NarRaceCourseTypeの型定義
 */
export type NarRaceCourseType = z.infer<typeof NarRaceCourseTypeSchema>;

/**
 * 地方競馬の競馬の馬場種別 リスト
 */
const NarRaceCourseTypeList = new Set(['芝', 'ダート']);

/**
 * 地方競馬の馬場種別のバリデーション
 * @param type - 地方競馬の馬場種別
 * @returns - バリデーション済みの地方競馬の馬場種別
 */
export const validateNarRaceCourseType = (type: string): NarRaceCourseType =>
    NarRaceCourseTypeSchema.parse(type);
