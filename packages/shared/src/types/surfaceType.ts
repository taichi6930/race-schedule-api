import { z } from 'zod';

/**
 * RaceSurfaceTypeのzod型定義に使うリスト
 */
export const RaceSurfaceTypeList = new Set([
    '芝',
    'ダート',
    '障害',
    'AW',
    '不明',
]);

/**
 * RaceSurfaceTypeのzodスキーマ
 */
export const RaceSurfaceTypeSchema = z.string().refine((value) => {
    return RaceSurfaceTypeList.has(value);
}, '有効な競馬場種別ではありません');

/**
 * RaceSurfaceTypeの型定義
 */
export type RaceSurfaceType = z.infer<typeof RaceSurfaceTypeSchema>;
