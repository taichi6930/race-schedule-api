import { z } from 'zod';

/**
 * WRaceNameのzod型定義
 */
const RaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * RaceNameの型定義
 */
export type RaceName = z.infer<typeof RaceNameSchema>;

/**
 * オートレースのレース名のバリデーション
 * @param name - オートレースのレース名
 * @returns - バリデーション済みのオートレースのレース名
 */
export const validateRaceName = (name: string): RaceName =>
    RaceNameSchema.parse(name);
