import { z } from 'zod';
/**
 * RaceSurfaceTypeのzod型定義
 */
const RaceSurfaceTypeList = new Set(['芝', 'ダート', '障害', 'AW', '不明']);

/**
 * RaceSurfaceTypeの型定義
 */
const RaceSurfaceTypeSchema = z.string().refine((value) => {
    return RaceSurfaceTypeList.has(value);
}, '有効な競馬場種別ではありません');

/**
 * RaceSurfaceTypeの型定義
 */
export type RaceSurfaceType = z.infer<typeof RaceSurfaceTypeSchema>;

/**
 * 馬場種別のバリデーション
 * @param surfaceType - 馬場種別
 * @returns - バリデーション済みの馬場種別
 */
export const validateRaceSurfaceType = (
    surfaceType: string,
): RaceSurfaceType => {
    return RaceSurfaceTypeSchema.parse(surfaceType);
};
