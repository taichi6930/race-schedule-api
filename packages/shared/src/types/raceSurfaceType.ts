import type { RaceSurfaceType } from './surfaceType';
import { RaceSurfaceTypeSchema } from './surfaceType';

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

export type { RaceSurfaceType } from './surfaceType';
