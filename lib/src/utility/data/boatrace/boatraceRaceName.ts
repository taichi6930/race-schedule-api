import { z } from 'zod';

/**
 * BoatraceRaceNameのzod型定義
 */
const BoatraceRaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * BoatraceRaceNameの 型定義
 */
export type BoatraceRaceName = z.infer<typeof BoatraceRaceNameSchema>;

/**
 * ボートレースのレース名のバリデーション
 * @param name - ボートレースのレース名
 * @returns - バリデーション済みのボートレースのレース名
 */
export const validateBoatraceRaceName = (name: string): BoatraceRaceName =>
    BoatraceRaceNameSchema.parse(name);
